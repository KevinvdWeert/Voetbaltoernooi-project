<?php 
require_once 'includes/init.php';
require_once 'includes/header.php'; 
?>

<main class="min-h-[70vh] bg-slate-50">
	<div id="app" class="mx-auto max-w-7xl px-4 py-6"></div>
	<noscript>
		<div class="mx-auto max-w-2xl px-4 py-12 text-center">
			<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
				<p class="text-red-700 dark:text-red-300 font-semibold">JavaScript is required for this page.</p>
			</div>
		</div>
	</noscript>
	<script>
		// Ensure route when directly hitting this page
		if (!location.hash || location.hash === '#/' ) {
			location.hash = '#/teams';
		}
	</script>
</main>

<?php require_once 'includes/footer.php'; ?>