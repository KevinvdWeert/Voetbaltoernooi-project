<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover">
    <meta name="description" content="Beheer je voetbaltoernooi eenvoudig met ons management systeem. Volg teams, wedstrijden, en uitslagen in real-time.">
    <meta name="keywords" content="voetbaltoernooi, toernooi beheer, voetbal management, wedstrijden, teams, uitslagen">
    <meta name="author" content="Voetbaltoernooi Project">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#3b82f6">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Voetbaltoernooi">
    <meta name="format-detection" content="telephone=no">

    <meta property="og:type" content="website">
    <meta property="og:title" content="Voetbaltoernooi Management Systeem">
    <meta property="og:description" content="Beheer je voetbaltoernooi eenvoudig met ons management systeem. Volg teams, wedstrijden, en uitslagen in real-time.">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Voetbaltoernooi Management Systeem">
    <meta name="twitter:description" content="Beheer je voetbaltoernooi eenvoudig met ons management systeem. Volg teams, wedstrijden, en uitslagen in real-time.">

    <title>Voetbaltoernooi Management Systeem | Teams & Wedstrijden</title>
    <link rel="icon" type="image/x-icon" href="./assets/img/favicon.ico">
    <link rel="manifest" href="./manifest.json">
    <link rel="apple-touch-icon" href="./assets/img/icon-192.png">
    
    <link rel="preconnect" href="https://code.jquery.com" crossorigin>
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="./assets/css/style.css">
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