
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <h1 class="text-2xl font-bold text-gray-800">Login/Register</h1>
  <form method="post" action="?/login" use:enhance class="w-full max-w-sm mt-4">
  	<label class="block mb-2">
  		<span class="text-gray-700">Username</span>
  		<input name="username" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none" />
  	</label>
  	<label class="block mb-2">
  		<span class="text-gray-700">Password</span>
  		<input type="password" name="password" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none" />
  	</label>
  	<div class="flex justify-between mt-4">
  	  <button class="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600">Login</button>
  	  <button formaction="?/register" class="px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-600">Register</button>
  	</div>
  </form>
  <p class="mt-4 text-red-500">{form?.message ?? ''}</p>
</div>
      

