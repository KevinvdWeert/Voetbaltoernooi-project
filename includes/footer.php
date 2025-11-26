<footer class="border-t border-slate-200 dark:border-slate-800 py-8 mt-12">
    <div class="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500">
        &copy; <?php echo date("Y"); ?> Voetbaltoernooi Project. All rights reserved.
    </div>
</footer>

<!-- React + Babel (CDN) -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<!-- UI helpers (loader, progress, toasts) -->
<script src="./assets/js/script.js"></script>

<!-- App -->
<script type="text/babel" data-presets="env,react" src="./assets/js/app.jsx"></script>

<script>
// Mobile menu toggle
document.getElementById('mobileMenuToggle')?.addEventListener('click', () => {
  const el = document.getElementById('mobileMenu');
  if (el) el.classList.toggle('hidden');
});
</script>
</body>
</html>