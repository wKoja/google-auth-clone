<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
	<h1 class="text-2xl font-bold text-gray-800">Hi, {data.user.username}!</h1>
	<p class="mt-2 text-gray-600">Your user ID is {data.user.id}.</p>
	<a href="/totp" class="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
		>2FA Codes</a
	>

	<form method="post" action="?/logout" use:enhance class="mt-4">
		<button class="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
			>Sign out</button
		>
	</form>
</div>

