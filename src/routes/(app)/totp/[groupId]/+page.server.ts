import type { RequestEvent } from './$types';
import * as auth from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';
import { fetchTOTPSecretsByGroupId, fetchTOTPGroupById } from '$lib/server/totp';

export const load = async (event: RequestEvent) => {
  const groupId: string = event.params.groupId;
  const sessionToken = event.cookies.get(auth.sessionCookieName);

  if (!sessionToken) {
    return redirect(302, '/sign-in');
  }

  const totpGroup = await fetchTOTPGroupById(sessionToken, groupId);

  const totpCodes = await fetchTOTPSecretsByGroupId(sessionToken, groupId);

  return {
    totpGroup,
    totpCodes
  };
};
