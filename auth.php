<?php
/**
 * Authentication Helper Functions
 */

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

/**
 * Get current user ID
 */
function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}

/**
 * Get current user data
 */
function getCurrentUser() {
    if (!isLoggedIn()) {
        return null;
    }
    
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare("SELECT u.id, u.name, u.email, r.name as role 
                               FROM users u 
                               LEFT JOIN roles r ON u.role_id = r.id 
                               WHERE u.id = ?");
        $stmt->execute([getCurrentUserId()]);
        return $stmt->fetch();
    } catch (PDOException $e) {
        error_log("Error fetching current user: " . $e->getMessage());
        return null;
    }
}

/**
 * Login user
 */
function loginUser($email, $password) {
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare("SELECT id, name, email, password_hash, role_id 
                               FROM users 
                               WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password_hash'])) {
            // Rehash password if algorithm updated
            if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
                $newHash = password_hash($password, PASSWORD_DEFAULT);
                $upd = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
                $upd->execute([$newHash, $user['id']]);
            }
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_role_id'] = $user['role_id'];
            return true;
        }
        
        return false;
    } catch (PDOException $e) {
        error_log("Login error: " . $e->getMessage());
        return false;
    }
}

/**
 * Logout user
 */
function logoutUser() {
    $_SESSION = array();
    
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    session_destroy();
}

/**
 * Require authentication
 */
function requireAuth() {
    if (!isLoggedIn()) {
        header('Location: ./login.php?redirect=' . urlencode($_SERVER['REQUEST_URI']));
        exit;
    }
}

/**
 * Check if user has specific role
 */
function hasRole($roleId) {
    return isset($_SESSION['user_role_id']) && $_SESSION['user_role_id'] == $roleId;
}

/**
 * Check if user is admin
 */
function isAdmin() {
    return hasRole(1); // Assuming role_id 1 is admin
}

/**
 * Register new user
 */
function registerUser($name, $email, $password, $roleId = 2) {
    try {
        $pdo = getDbConnection();
        
        // Check if email already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            return ['success' => false, 'message' => 'Email al in gebruik'];
        }
        
        // Hash password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert user
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash, role_id) 
                               VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $passwordHash, $roleId]);
        
        return ['success' => true, 'message' => 'Registratie succesvol'];
    } catch (PDOException $e) {
        error_log("Registration error: " . $e->getMessage());
        return ['success' => false, 'message' => 'Registratie mislukt'];
    }
}
?>
