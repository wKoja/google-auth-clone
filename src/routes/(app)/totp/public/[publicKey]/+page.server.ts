import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { fetchTOTPByPublicKey } from '$lib/server/totp';

export const load = async (event: RequestEvent) => {
	const publicKey: string = event.params.publicKey;

	if (!publicKey) {
		return redirect(302, '/totp');
	}

	const code = await fetchTOTPByPublicKey(publicKey);

	if (!code) {
		return redirect(302, '/sign-in');
	}

	return {
	  code
	};
};
