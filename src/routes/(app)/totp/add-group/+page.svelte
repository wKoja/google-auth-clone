<script lang="ts">
</script>

<a
	href={`/totp`}
	class="absolute rounded bg-blue-500 m-4 px-3 py-3 text-white hover:bg-blue-600">Return to groups</a
>
<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <h1 class="text-2xl font-bold text-gray-800">Add New TOTP Group</h1>
  <form method="post" action="?/add" class="w-full max-w-sm mt-4">
    <label class="block mb-2">
      <span class="text-gray-700">Group name</span>
      <input name="groupName" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none" />
    </label>
    <button class="px-4 py-2 mt-4 font-semibold text-white bg-blue-500 w-full rounded hover:bg-blue-600">Add Code</button>
  </form>
</div>
