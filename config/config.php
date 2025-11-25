<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'voetbaltoernooi');
define('DB_USER', 'root');
define('DB_PASS', '');

// Session Configuration
define('SESSION_LIFETIME', 3600); // 1 hour in seconds

// Application Configuration
define('APP_NAME', 'Voetbaltoernooi');
define('APP_URL', 'http://localhost');

// Timezone
date_default_timezone_set('Europe/Amsterdam');

// Error Reporting (set to 0 in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Session settings
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Set to 1 if using HTTPS
?>