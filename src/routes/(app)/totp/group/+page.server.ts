import { fail, redirect, type Actions } from "@sveltejs/kit";
import * as auth from '$lib/server/auth.js';
import { saveTOTPGroup } from "$lib/server/totp";
import { errorLog, infoLog } from "$lib/logger";

export const actions: Actions = {
  add: async (event) => {
    const formData = await event.request.formData();
    const sessionToken = event.cookies.get(auth.sessionCookieName);
    const groupName = formData.get('groupName')?.toString();

    if (!sessionToken || !groupName) {
      errorLog('saveTOTPGroup', 'session token or group name not found')
      return fail(400, { message: 'Invalid request' });
    }

    saveTOTPGroup(sessionToken, groupName)

    return redirect(302, '/totp');
  }
};
