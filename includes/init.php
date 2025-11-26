<?php
// Start with config (this sets session ini settings)
require_once __DIR__ . '/../config/config.php';

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Get database connection function
require_once __DIR__ . '/../database/connection.php';

// Load authentication functions
require_once __DIR__ . '/../auth.php';

// Define page configuration
$pageConfig = [
    'title' => 'Voetbaltoernooi Management',
    'description' => 'Beheer je voetbaltoernooi eenvoudig met ons management systeem',
    'bodyClass' => '',
    'showHeader' => true,
    'showFooter' => true,
    'requireAuth' => false
];

// Helper function to set page config
function setPageConfig($config) {
    global $pageConfig;
    $pageConfig = array_merge($pageConfig, $config);
}

// Helper function to get page config
function getPageConfig($key = null) {
    global $pageConfig;
    return $key ? ($pageConfig[$key] ?? null) : $pageConfig;
}

// Unified JSON response helper
function jsonResponse($success, $data = null, $error = null, $code = 200) {
    if (!headers_sent()) {
        header('Content-Type: application/json');
        http_response_code($code);
    }
    $payload = ['success' => $success];
    if ($success && $data !== null) { $payload['data'] = $data; }
    if (!$success) {
        $payload['error'] = is_array($error) ? $error : ['message' => $error ?: 'Onbekende fout'];
    }
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// CSRF utilities
function getCsrfToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCsrfToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}
?>