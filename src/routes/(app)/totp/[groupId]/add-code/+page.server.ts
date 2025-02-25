import { fail, redirect, type Actions } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { saveTOTPSecret } from '$lib/server/totp';

export const load = async (event) => {
  const groupId: string = event.params.groupId;
  return {
    groupId
  };
}

export const actions: Actions = {
  add: async (event) => {
    const groupId = event.params.groupId;
    const formData = await event.request.formData();
    const sessionToken = event.cookies.get(auth.sessionCookieName);
    const secret = formData.get('secret')?.toString();
    const note = formData.get('note')?.toString();
    const username = formData.get('username')?.toString();

    console.log('secret', secret)
    console.log('note', note)
    console.log('username', username)

    if (!sessionToken || !secret || !username) {
      return fail(400, { message: 'Invalid request' });
    }

    saveTOTPSecret(sessionToken, secret, note || null, username, groupId || null)


    return redirect(302, `/totp/${groupId}`);
  }
};
