<?php
require_once 'includes/init.php';
require_once 'includes/header.php';
?>

<main class="min-h-[70vh] bg-slate-50">
  <div id="app" class="mx-auto max-w-7xl px-4 py-6"></div>
  <noscript>
    <div class="mx-auto max-w-2xl px-4 py-12 text-center">
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <svg class="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">JavaScript Required</h3>
        <p class="text-red-700 dark:text-red-300">This website requires JavaScript to function. Please enable JavaScript and reload the page.</p>
      </div>
    </div>
  </noscript>
</main>

<?php require_once 'includes/footer.php'; ?>