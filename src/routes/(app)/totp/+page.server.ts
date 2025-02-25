import * as auth from '$lib/server/auth.js';
import type { TOTPGroup } from '$lib/server/db/schema';
import { deleteTOTPGroup, fetchTOTPGroups } from '$lib/server/totp';
import { redirect, type Actions } from '@sveltejs/kit';

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

export const actions: Actions = {
  deleteGroup: async (event) => {
    const formData = await event.request.formData();
    const sessionToken = event.cookies.get(auth.sessionCookieName);
    const groupId = formData.get('groupId')?.toString();

    deleteTOTPGroup(sessionToken, groupId);

    return redirect(302, `/totp`);
  }
}
