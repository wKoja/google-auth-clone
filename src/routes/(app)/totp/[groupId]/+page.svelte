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
			creationTimestamp: number;
		};
	}

	let { data }: Props = $props();
	let otpMap: OTPMap = $state({});

	const TIME_STEP = 30;

	const groupId = data.totpGroup?.id;
	const groupName = data.totpGroup?.name;
	const codes = data.totpCodes;

	let timerId;
	let totpSecondsLeft = $state(0);

	const computeOTP = () => {
		codes.forEach(async (code) => {
			const totp = generateTOTP(code.username, code.secret);
			otpMap[code.secret] = { totp, creationTimestamp: Date.now() };
		});
	};

	const computeProgressBarVal = (secondsLeft: number) => {
		return Math.floor((secondsLeft / TIME_STEP) * 100);
	};

	onMount(async () => {
		totpSecondsLeft = parseInt(localStorage.getItem('timeRemaining') || '30'); 

		computeOTP();

		timerId = setInterval(() => {
			totpSecondsLeft -= 1;
			if (totpSecondsLeft <= 0) {
				totpSecondsLeft = TIME_STEP;
				computeOTP()
			}
			localStorage.setItem('timeRemaining', totpSecondsLeft.toString());
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
					<span class="text-gray-700">{otpMap[code.secret]?.totp.generate() || 'loading...'}</span>
					<button class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">Copy</button>
				</div>
				<timer class="mt-4 w-full max-w-md">
					<div class="relative h-2 max-w-xl overflow-hidden rounded-full">
						<div class="absolute h-full w-full bg-gray-300"></div>
						<div
							class={`absolute h-full bg-blue-500`}
							style="width: {computeProgressBarVal(totpSecondsLeft)}%"
						></div>
					</div>
					<p class="mt-2 text-sm text-gray-700">
						Next code update in {totpSecondsLeft} seconds
					</p>
				</timer>
			</li>
		{/each}
	</ul>
</div>
