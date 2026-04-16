<?php
require_once 'config.php';

// Start a secure session for admin authentication.
// Uses standard PHP session cookies and keeps login state on the server.
if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax',
        'cookie_secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    ]);
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
    if ($username === ADMIN_USERNAME && hash_equals(ADMIN_PASSWORD, $password)) {
        session_regenerate_id(true);
        $_SESSION['admin_authenticated'] = true;
        $_SESSION['admin_username'] = $username;
        return true;
    }

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
