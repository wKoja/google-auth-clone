<script lang="ts">
//TODO: implement 2FA
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <h1 class="text-2xl font-bold text-gray-800">Two-Factor Authentication (2FA) Codes</h1>
  <a href="/totp/add" class="px-3 py-3 text-white bg-blue-500 rounded hover:bg-blue-600">Add new code</a>
  <ul class="w-full max-w-md mt-4">
    <li class="mb-2">
      <div class="flex items-center justify-between p-4 bg-white rounded-md shadow">
        <span class="text-gray-700">TOTP Code #1</span>
        <button class="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">Copy</button>
      </div>
    </li>
    <li class="mb-2">
      <div class="flex items-center justify-between p-4 bg-white rounded-md shadow">
        <span class="text-gray-700">TOTP Code #2</span>
        <button class="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">Copy</button>
      </div>
    </li>
  </ul>
</div>
      

