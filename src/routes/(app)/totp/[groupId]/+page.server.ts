import type { RequestEvent } from './$types';
import * as auth from '$lib/server/auth.js';
import { redirect, type Actions } from '@sveltejs/kit';
import { fetchTOTPSecretsByGroupId, fetchTOTPGroupById, deleteTOTPSecret } from '$lib/server/totp';

export const load = async (event: RequestEvent) => {
  const groupId: string = event.params.groupId;
  const sessionToken = event.cookies.get(auth.sessionCookieName);

  if (!sessionToken) {
    return redirect(302, '/sign-in');
  }

  const totpGroup = await fetchTOTPGroupById(sessionToken, groupId);

  if (!totpGroup) {
    return redirect(302, '/totp');
  }

  const totpCodes = await fetchTOTPSecretsByGroupId(sessionToken, groupId);

  return {
    totpGroup,
    totpCodes,
    groupId
  };
};

export const actions: Actions = {
  deleteCode: async (event) => {
    const groupId = event.params.groupId;
    const formData = await event.request.formData();
    const sessionToken = event.cookies.get(auth.sessionCookieName);
    const secretId = formData.get('secretId')?.toString();

    deleteTOTPSecret(sessionToken, secretId);

    return redirect(302, `/totp/${groupId}`);
  }
}
