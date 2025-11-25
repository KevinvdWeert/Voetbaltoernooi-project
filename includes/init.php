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
?>