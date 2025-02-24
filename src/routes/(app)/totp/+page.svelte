<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	//TODO: fetch existing gropus and list them below using each block 

	let { data }: Props = $props();

	const routeToGroup = (groupId: string) => {
		goto(`/totp/${groupId}`);
	};
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
	<h1 class="text-2xl font-bold text-gray-800">2FA Groups</h1>
	<a href="/totp/group" class="rounded bg-blue-500 px-3 py-3 text-white hover:bg-blue-600"
		>Add new group</a
	>
	<ul class="mt-4 w-full max-w-md">
		<li class="mb-2">
			<div class="flex items-center justify-between rounded-md bg-white p-4 shadow">
				<span class="text-gray-700">No group codes</span>
				<button onclick={() => routeToGroup("id1")} class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">Open</button>
			</div>
		</li>
		<li class="mb-2">
			<div class="flex items-center justify-between rounded-md bg-white p-4 shadow">
				<span class="text-gray-700">TOTP Group #1</span>
				<button onclick={() => routeToGroup("id2")} class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">Open</button>
			</div>
		</li>
		<li class="mb-2">
			<div class="flex items-center justify-between rounded-md bg-white p-4 shadow">
				<span class="text-gray-700">TOTP Group #2</span>
				<button onclick={() => routeToGroup("id3")} class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">Open</button>
			</div>
		</li>
	</ul>
</div>

