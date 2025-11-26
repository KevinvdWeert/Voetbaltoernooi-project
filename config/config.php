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

// Session settings - MUST be set before session_start()
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    // In production behind HTTPS set cookie_secure=1
    ini_set('session.cookie_secure', 0); // TODO: switch to 1 when served over HTTPS
    // SameSite to mitigate CSRF; Lax allows typical navigation; use Strict for higher security
    ini_set('session.cookie_samesite', 'Lax');
}

// Derive environment (simple heuristic; customize as needed)
define('APP_ENV', strpos(APP_URL, 'localhost') !== false ? 'local' : 'production');
?>