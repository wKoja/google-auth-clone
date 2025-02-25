<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const groupId = data.groupId;
</script>

<a
	href={`/totp/${groupId}`}
	class="absolute m-4 rounded bg-blue-500 px-3 py-3 text-white hover:bg-blue-600">Return to codes</a
>
<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
	<h1 class="text-2xl font-bold text-gray-800">Add New TOTP Code</h1>
	<form method="post" action="?/add" class="mt-4 w-full max-w-sm">
		<label class="mb-2 block">
			<span class="text-gray-700">Username</span>
			<input
				name="username"
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
			/>
		</label>
		<label class="mb-2 block">
			<span class="text-gray-700">Secret</span>
			<input
				name="secret"
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
			/>
		</label>
		<label class="mb-2 block">
			<span class="text-gray-700">Note (optional)</span>
			<input
				name="note"
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
			/>
		</label>
		<button
			class="mt-4 w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
			>Add Code</button
		>
	</form>
</div>
