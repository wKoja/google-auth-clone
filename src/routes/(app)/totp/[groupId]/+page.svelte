<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { computeTOTP } from '$lib/client/totp-utils';

	interface Props {
		data: PageData;
	}

	interface OTPMap {
		[key: string]: string;
	}

	let { data }: Props = $props();
	let otpMap: OTPMap = $state({});

	const groupId = data.totpGroup?.id;
	const groupName = data.totpGroup?.name;
	const codes = data.totpCodes;

	const computeOTP = () => {
		codes.forEach(async (code) => {
			const computed = await computeTOTP(code.secret);
			otpMap[code.secret] = computed;
		});
	};

	let intervalId;
	onMount(async () => {
		//compute initial values
		computeOTP();
		intervalId = setInterval(computeOTP, 30000);
	});

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
	<h1 class="text-2xl font-bold text-gray-800">{groupName} 2FA codes</h1>
	<a
		href={`/totp/${groupId}/add`}
		class="rounded bg-blue-500 px-3 py-3 text-white hover:bg-blue-600">Add new code</a
	>
	<ul class="mt-4 w-full max-w-md">
		{#each codes as code}
			<li class="mb-2">
				<h1 class="text-bold text-2xl text-gray-700">{code.username}</h1>
				<div class="flex items-center justify-between rounded-md bg-white p-4 shadow">
					<span class="text-gray-700">{otpMap[code.secret]}</span>
					<button class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">Copy</button>
				</div>
			</li>
		{/each}
	</ul>
</div>
