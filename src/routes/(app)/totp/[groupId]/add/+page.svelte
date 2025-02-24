<script lang="ts">
//TODO: get list of groups so user optionally selects it 
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <h1 class="text-2xl font-bold text-gray-800">Add New TOTP Code</h1>
  <form method="post" action="?/add" class="w-full max-w-sm mt-4">
    <label class="block mb-2">
      <span class="text-gray-700">Username</span>
      <input name="totp_code" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none" />
    </label>
    <label class="block mb-2">
      <span class="text-gray-700">Secret</span>
      <input name="totp_code" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none" />
    </label>
    <label class="block mb-2">
      <span class="text-gray-700">Note (optional)</span>
      <input name="description" class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none" />
    </label>
    <button class="px-4 py-2 mt-4 font-semibold text-white bg-blue-500 w-full rounded hover:bg-blue-600">Add Code</button>
  </form>
</div>
