<?php
require_once 'config.php';

// Start a secure session for admin authentication.
// Uses standard PHP session cookies and keeps login state on the server.
if (session_status() === PHP_SESSION_NONE) {
    // Try to set a custom session save path if possible
    $possiblePaths = [
        '/tmp',
        '/var/tmp',
        sys_get_temp_dir(),
        __DIR__ . '/sessions'
    ];
    
    foreach ($possiblePaths as $path) {
        if (is_dir($path) && is_writable($path)) {
            session_save_path($path);
            break;
        }
    }
    
    if (!session_start([
        'cookie_httponly' => true,
        // Removed cookie_samesite for local development compatibility
        'cookie_secure' => false,
    ])) {
        error_log('Failed to start session');
        // Continue without session - admin features will not work
    }
}

const ADMIN_USERNAME = 'ymcaph';
const ADMIN_PASSWORD = 'Ymc@19!1';

function isAdminAuthenticated(): bool {
    return isset($_SESSION['admin_authenticated']) && $_SESSION['admin_authenticated'] === true;
}

function requireAdminAuth() {
    if (!isAdminAuthenticated()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
}

function loginAdmin(string $username, string $password): bool {
    error_log("[loginAdmin] Attempting login for username: '$username', password length: " . strlen($password));
    error_log("[loginAdmin] Expected username: '" . ADMIN_USERNAME . "', expected password: '" . ADMIN_PASSWORD . "'");

    if ($username === ADMIN_USERNAME && $password === ADMIN_PASSWORD) {
        error_log("[loginAdmin] Login successful");
        // session_regenerate_id(true); // Temporarily disabled for debugging
        $_SESSION['admin_authenticated'] = true;
        $_SESSION['admin_username'] = $username;
        return true;
    }

    error_log("[loginAdmin] Login failed - credentials don't match");
    return false;
}

function logoutAdmin() {
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }

    session_destroy();
}
