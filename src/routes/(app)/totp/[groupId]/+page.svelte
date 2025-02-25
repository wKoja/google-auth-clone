<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { computeTimeLeft, generateTOTP } from '$lib/client/totp-utils';
	import type { TOTP } from 'otpauth';

	interface Props {
		data: PageData;
	}

	interface OTPMap {
		[key: string]: {
			totp: TOTP;
			computedCode: string;
			timeLeft: number;
		};
	}

	let { data }: Props = $props();
	let otpMap: OTPMap = $state({});

	const TIME_STEP = 30;

	const groupId = data.totpGroup?.id;
	const groupName = data.totpGroup?.name;
	const codes = data.totpCodes;

	let timerId;

	const computeOTP = () => {
		codes.forEach(async (code) => {
			const totp = generateTOTP(code.username, code.secret);
			const timeLeft = computeTimeLeft(totp);
			otpMap[code.secret] = { totp, computedCode: totp.generate(), timeLeft };
			return;
		});
	};

	const computeProgressBarVal = (secondsLeft: number) => {
		return Math.floor((secondsLeft / TIME_STEP) * 100);
	};

	onMount(async () => {
		computeOTP();

		timerId = setInterval(() => {
			computeOTP();
		}, 1000);
	});

	onDestroy(() => {
		if (timerId) {
			clearInterval(timerId);
		}
	});
</script>

<a href={`/totp`} class="absolute m-4 rounded bg-blue-500 px-3 py-3 text-white hover:bg-blue-600"
	>Return to groups</a
>
<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
	<h1 class="text-2xl font-bold text-gray-800">{groupName} 2FA codes</h1>
	<a
		href={`/totp/${groupId}/add-code`}
		class="rounded bg-blue-500 px-3 py-3 text-white hover:bg-blue-600">Add new code</a
	>
	<ul class="mt-4 w-full max-w-md">
		{#each codes as code}
			<li class="mb-2">
				<h1 class="text-bold text-2xl text-gray-700">{code.username}</h1>
				<div class="flex items-center justify-between rounded-md bg-white p-4 shadow">
					<span class="text-gray-700">{otpMap[code.secret]?.computedCode || 'loading...'}</span>
					<buttons-group class="flex space-x-1">
						<form method="post" action="?/shareCode">
							<input value={code.id} name="secretId" hidden />
							<button class="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
								>Share</button
							>
						</form>
						<form method="post" action="?/deleteCode">
							<input value={code.id} name="secretId" hidden />
							<button class="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
								>Delete</button
							>
						</form>
						<button
							onclick={() => navigator.clipboard.writeText(otpMap[code.secret]?.computedCode)}
							class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">Copy</button
						>
					</buttons-group>
				</div>
				<timer class="mt-4 w-full max-w-md">
					<div class="relative h-2 max-w-xl overflow-hidden rounded-full">
						<div class="absolute h-full w-full bg-gray-300"></div>
						<div
							class={`absolute h-full bg-blue-500`}
							style="width: {computeProgressBarVal(otpMap[code.secret]?.timeLeft)}%"
						></div>
					</div>
					<p class="mt-2 text-sm text-gray-700">
						Next code update in {otpMap[code.secret]?.timeLeft} seconds
					</p>
				</timer>
			</li>
		{/each}
	</ul>
</div>
