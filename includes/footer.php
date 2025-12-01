<!-- Footer mount point for React -->
<div id="footer-root"></div>

<script src="./assets/js/script.js"></script>

<?php $APP_DEV = isset($_SERVER['HTTP_HOST']) && str_contains($_SERVER['HTTP_HOST'], 'localhost'); ?>
<?php if ($APP_DEV): ?>
  <!-- Dev: UMD + in-browser Babel -->
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel" data-presets="env,react" src="./assets/js/app.jsx"></script>
<?php else: ?>
  <!-- Prod: precompiled bundle (build and output to this path) -->
  <script src="./assets/js/app.bundle.js"></script>
<?php endif; ?>