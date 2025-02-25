<script lang="ts">
	import type { TOTP } from 'otpauth';
	import type { PageData } from './$types';
	import { computeTimeLeft, generateTOTP } from '$lib/client/totp-utils';
	import { onDestroy, onMount } from 'svelte';

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

	const code = data.code;

	let timerId;

	const computeOTP = () => {
		const totp = generateTOTP(code.username, code.secret);
		const timeLeft = computeTimeLeft(totp);
		otpMap[code.secret] = { totp, computedCode: totp.generate(), timeLeft };
		return;
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

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
	<h1 class="text-2xl font-bold text-gray-800">Shared 2FA code</h1>
	<ul class="mt-4 w-full max-w-md">
		<li class="mb-2">
			<h1 class="text-bold text-2xl text-gray-700">{code.username}</h1>
			<div class="flex items-center justify-between rounded-md bg-white p-4 shadow">
				<span class="text-gray-700">{otpMap[code.secret]?.computedCode || 'loading...'}</span>
				<buttons-group class="flex space-x-1">
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
	</ul>
</div>
