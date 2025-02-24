import { eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { validateSessionToken } from './auth';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { errorLog, infoLog } from '$lib/logger';

//NOTE: private functions

export async function saveTOTPSeed(sessionToken: string | undefined, secret: string, note: string | null, TOTPGroupId: string | null) {
  if (!sessionToken) {
    errorLog('saveTOTPSeed', 'session token not found')
    return
  }

  const sessionInfo = await validateSessionToken(sessionToken)
  const user = sessionInfo.user

  if (!user) {
    errorLog('saveTOTPSeed', 'user not found')
    return
  }

  infoLog('saveTOTPSeed', `Saving TOTP seed for user ${user.id} in group ${TOTPGroupId}`)

  const totpSecret: table.TOTPSecret = {
    id: generateId(),
    userId: user.id,
    totpGroupId: TOTPGroupId,
    note,
    secret,
  }

	await db.insert(table.totpSecret).values(totpSecret);
}

export async function saveTOTPGroup(sessionToken: string | undefined, name: string) {
  if (!sessionToken) {
    errorLog('saveTOTPGroup', 'session token not found')
    return
  }

  const sessionInfo = await validateSessionToken(sessionToken)
  const user = sessionInfo.user

  if (!user) {
    errorLog('saveTOTPGroup', 'user not found')
    return
  }

  infoLog('saveTOTPGroup', `Saving TOTP group for user ${user.id}`)

  const totpGroup: table.TOTPGroup = {
    id: generateId(),
    userId: user.id,
    publicUserKey: null,
    name,
  }

  await db.insert(table.totpGroup).values(totpGroup);

}

export async function updateTOTPGroup(sessionToken: string, name: string | null, publicUserKey: string | null) {
  const sessionInfo = await validateSessionToken(sessionToken)
  const user = sessionInfo.user

  if (!user) {
    errorLog('updateTOTPGroup', 'user not found')
    return
  }

  infoLog('updateTOTPGroup', `Updating TOTP group for user ${user.id}`)
  const [result] = await db.select().from(table.totpGroup).where(eq(table.totpGroup.userId, user.id));
  const totpGroup = result

  totpGroup.publicUserKey = publicUserKey || totpGroup.publicUserKey
  totpGroup.name = name || totpGroup.name

  await db.update(table.totpGroup).set(totpGroup).where(eq(table.totpGroup.userId, user.id));

}


function generateId(){ 
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}
