import { and, eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { validateSessionToken } from './auth';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { errorLog, infoLog } from '$lib/logger';

//NOTE: private functions

export async function saveTOTPSecret(
  sessionToken: string | undefined,
  secret: string,
  note: string | null,
  username: string,
  TOTPGroupId: string | null
) {
  if (!sessionToken) {
    errorLog('saveTOTPSeed', 'session token not found');
    return;
  }

  const sessionInfo = await validateSessionToken(sessionToken);
  const user = sessionInfo.user;

  if (!user) {
    errorLog('saveTOTPSeed', 'user not found');
    return;
  }

  infoLog('saveTOTPSeed', `Saving TOTP seed for user ${user.id} in group ${TOTPGroupId}`);

  const totpSecret: table.TOTPSecret = {
    id: generateId(),
    userId: user.id,
    totpGroupId: TOTPGroupId,
    note,
    username,
    secret
  };

  await db.insert(table.totpSecret).values(totpSecret);
}

export async function fetchTOTPSecretsByGroupId(
  sessionToken: string | undefined,
  groupId: string | null
): Promise<table.TOTPSecret[]> {
  if (!sessionToken) {
    errorLog('fetchTOTPSecrets', 'session token not found');
    return [];
  }

  const sessionInfo = await validateSessionToken(sessionToken);
  const user = sessionInfo.user;

  if (!user) {
    errorLog('fetchTOTPSecrets', 'user not found');
    return [];
  }

  return db
    .select()
    .from(table.totpSecret)
    .where(
      and(eq(table.totpSecret.totpGroupId, groupId || ''), eq(table.totpSecret.userId, user.id))
    );
}

export async function saveTOTPGroup(sessionToken: string | undefined, name: string) {
  if (!sessionToken) {
    errorLog('saveTOTPGroup', 'session token not found');
    return;
  }

  const sessionInfo = await validateSessionToken(sessionToken);
  const user = sessionInfo.user;

  if (!user) {
    errorLog('saveTOTPGroup', 'user not found');
    return;
  }

  infoLog('saveTOTPGroup', `Saving TOTP group for user ${user.id}`);

  const totpGroup: table.TOTPGroup = {
    id: generateId(),
    userId: user.id,
    publicUserKey: null,
    name
  };

  await db.insert(table.totpGroup).values(totpGroup);
}

export async function updateTOTPGroup(
  sessionToken: string,
  name: string | null,
  publicUserKey: string | null
) {
  const sessionInfo = await validateSessionToken(sessionToken);
  const user = sessionInfo.user;

  if (!user) {
    errorLog('updateTOTPGroup', 'user not found');
    return;
  }

  infoLog('updateTOTPGroup', `Updating TOTP group for user ${user.id}`);
  const [result] = await db
    .select()
    .from(table.totpGroup)
    .where(eq(table.totpGroup.userId, user.id));
  const totpGroup = result;

  totpGroup.publicUserKey = publicUserKey || totpGroup.publicUserKey;
  totpGroup.name = name || totpGroup.name;

  await db.update(table.totpGroup).set(totpGroup).where(eq(table.totpGroup.userId, user.id));
}

export async function fetchTOTPGroups(sessionToken: string): Promise<table.TOTPGroup[]> {
  const sessionInfo = await validateSessionToken(sessionToken);
  const user = sessionInfo.user;

  if (!user) {
    errorLog('fetchTOTPGroups', 'user not found');
    return [];
  }

  infoLog('fetchTOTPGroups', `Fetching TOTP groups for user ${user.id}`);
  const totpGroups = await db
    .select()
    .from(table.totpGroup)
    .where(eq(table.totpGroup.userId, user.id));
  return totpGroups;
}

export async function fetchTOTPGroupById(
  sessionToken: string,
  groupId: string
): Promise<table.TOTPGroup | null> {
  const sessionInfo = await validateSessionToken(sessionToken);
  const user = sessionInfo.user;

  if (!user) {
    errorLog('fetchTOTPGroupById', 'user not found');
    return null;
  }

  infoLog('fetchTOTPGroupById', `Fetching TOTP group ${groupId} for user ${user.id}`);
  const [result] = await db.select().from(table.totpGroup).where(eq(table.totpGroup.id, groupId));

  return result;
}

function generateId() {
  // ID with 120 bits of entropy, or about the same as UUID v4.
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}
