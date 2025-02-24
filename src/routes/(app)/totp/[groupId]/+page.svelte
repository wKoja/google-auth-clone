<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const groupId = data.groupId
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
	<h1 class="text-2xl font-bold text-gray-800">Group {groupId} 2FA codes</h1>
	<a href={`/totp/${groupId}/add`} class="rounded bg-blue-500 px-3 py-3 text-white hover:bg-blue-600"
		>Add new code</a
	>
	<ul class="mt-4 w-full max-w-md">
		<li class="mb-2">
			<div class="flex items-center justify-between rounded-md bg-white p-4 shadow">
				<span class="text-gray-700">TOTP Code #1</span>
				<button class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">Copy</button>
			</div>
		</li>
		<li class="mb-2">
			<div class="flex items-center justify-between rounded-md bg-white p-4 shadow">
				<span class="text-gray-700">TOTP Code #2</span>
				<button class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">Copy</button>
			</div>
		</li>
	</ul>
</div>
