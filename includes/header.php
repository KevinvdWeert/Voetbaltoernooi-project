<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover">
    <meta name="description" content="Manage your football tournament with ease. Track teams, matches, and results in real time.">
    <meta name="keywords" content="football tournament, tournament management, soccer management, matches, teams, results">
    <meta name="author" content="Football Tournament Project">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#3b82f6">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Football Tournament">
    <meta name="format-detection" content="telephone=no">

    <meta property="og:type" content="website">
    <meta property="og:title" content="Football Tournament Management System">
    <meta property="og:description" content="Manage your football tournament with ease. Track teams, matches, and results in real time.">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Football Tournament Management System">
    <meta name="twitter:description" content="Manage your football tournament with ease. Track teams, matches, and results in real time.">

    <title>Football Tournament Management System | Teams & Matches</title>
    <link id="site-favicon" rel="icon" type="image/x-icon" href="./assets/img/favicon_dark.ico">
    <?php
      $APP_DEV = isset($_SERVER['HTTP_HOST']) && str_contains($_SERVER['HTTP_HOST'], 'localhost');
      $hasManifest = file_exists(__DIR__ . '/../manifest.json');
      $hasIcon = file_exists(__DIR__ . '/../assets/img/icon-192.png');
    ?>
    <?php if ($APP_DEV): ?>
      <script src="https://cdn.tailwindcss.com"></script>
    <?php endif; ?>
    <link rel="stylesheet" href="./assets/css/style.css">
    <?php if ($hasManifest && $hasIcon): ?>
      <link rel="manifest" href="./manifest.json">
      <link rel="apple-touch-icon" href="./assets/img/icon-192.png">
    <?php endif; ?>

    <link rel="preconnect" href="https://code.jquery.com" crossorigin>
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    
</head>

<body>
<?php
// Ensure session started so we can expose minimal data
if (session_status() === PHP_SESSION_NONE) { session_start(); }
$sessionPayload = [
    'loggedIn' => isset($_SESSION['user_id']),
    'user' => isset($_SESSION['user_id']) ? [
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['user_name'] ?? null,
        'email' => $_SESSION['user_email'] ?? null,
        'role_id' => $_SESSION['user_role_id'] ?? null
    ] : null
];
?>
<script>window.APP_SESSION = <?php echo json_encode($sessionPayload, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES); ?>;</script>
<?php $csrf = function_exists('getCsrfToken') ? getCsrfToken() : null; ?>
<script>window.CSRF_TOKEN = <?php echo json_encode($csrf, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES); ?>;</script>
<?php if (!headers_sent()) { header('X-Frame-Options: SAMEORIGIN'); header('X-Content-Type-Options: nosniff'); } ?>
    <!-- React header mount -->
    <div id="header-root"></div>
</body>