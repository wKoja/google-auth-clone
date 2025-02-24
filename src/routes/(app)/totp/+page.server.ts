import * as auth from '$lib/server/auth.js';
import type { TOTPGroup } from '$lib/server/db/schema';
import { fetchTOTPGroups } from '$lib/server/totp';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
  const sessionToken = event.cookies.get(auth.sessionCookieName);

  if (!sessionToken) {
    return redirect(302, '/sign-in');
  }

  const totpGrops: TOTPGroup[] = await fetchTOTPGroups(sessionToken);

  return {
    totpGroups: totpGrops
  };
};
