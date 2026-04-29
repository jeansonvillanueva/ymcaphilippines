<?php
require_once 'config.php';
require_once 'utils.php';
require_once 'auth.php';

// Initialize database connection globally so all endpoints have access to $conn
$conn = getDatabaseConnection();

// Get the request URI and method
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Allow HTML forms and FormData to override method via _method field
if ($requestMethod === 'POST') {
    // Check $_POST first (for regular form submissions)
    if (isset($_POST['_method'])) {
        $override = strtoupper($_POST['_method']);
        if (in_array($override, ['PUT', 'DELETE', 'PATCH'], true)) {
            $requestMethod = $override;
            $_SERVER['REQUEST_METHOD'] = $override;
        }
    }
    // For FormData requests, check if _method is in the raw input
    else {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (strpos($contentType, 'multipart/form-data') !== false) {
            // Parse the raw multipart data to find _method field
            $rawInput = file_get_contents('php://input');
            if (strpos($rawInput, 'name="_method"') !== false) {
                // Extract the _method value from the multipart data
                preg_match('/name="_method"[\r\n]+[\r\n]+(PUT|DELETE|PATCH)/i', $rawInput, $matches);
                if (isset($matches[1])) {
                    $override = strtoupper($matches[1]);
                    $requestMethod = $override;
                    $_SERVER['REQUEST_METHOD'] = $override;
                }
            }
        }
    }
}

// Remove query string from URI
$path = parse_url($requestUri, PHP_URL_PATH);

// Support query parameter routing (?path=/...) as fallback for .htaccess issues
if (isset($_GET['path']) && !empty($_GET['path'])) {
    $path = $_GET['path'];
}

// Remove the script base path (supports nested folders like /testsite/php-api/)
$scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
$scriptDir = rtrim($scriptDir, '/');
if ($scriptDir !== '' && strpos($path, $scriptDir) === 0) {
    $path = substr($path, strlen($scriptDir));
}
if ($path === '') {
    $path = '/';
}

// Remove index.php from the request path if it is included
$path = preg_replace('#^/index\.php#', '', $path);
if ($path === '') {
    $path = '/';
}

// Remove the API folder prefix if present
$path = preg_replace('#^/php-api#', '', $path);
if ($path === '') {
    $path = '/';
}

// Protect admin routes unless they are public auth endpoints.
$publicAdminRoutes = ['/admin/login', '/admin/status', '/admin/logout'];
if (strpos($path, '/admin') === 0 && !in_array($path, $publicAdminRoutes, true)) {
    requireAdminAuth();
}

// Route the request
switch ($path) {
    // Test route
    case '/':
        if ($requestMethod === 'GET') {
            sendResponse(['message' => 'PHP API is running']);
        }
        break;

    // Public API routes
    case '/api/articles':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/articles.php';
        }
        break;

    case '/api/news':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/news.php';
        }
        break;

    case '/api/videos':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/videos.php';
        }
        break;

    case '/api/users':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/users.php';
        }
        break;

    case '/api/locals':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/locals.php';
        }
        break;

    case (preg_match('/^\/api\/locals\/(.+)$/', $path, $matches) ? true : false):
        if ($requestMethod === 'GET') {
            $_GET['id'] = $matches[1];
            require_once 'endpoints/local_detail.php';
        }
        break;

    case (preg_match('/^\/api\/pillars\/(.+)$/', $path, $matches) ? true : false):
        if ($requestMethod === 'GET') {
            $_GET['localId'] = $matches[1];
            require_once 'endpoints/pillars.php';
        }
        break;

    // Public staff directory endpoint
    case '/api/staff':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/staff.php';
        }
        break;

    // Public calendar endpoint
    case '/api/calendar':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/calendar.php';
        }
        break;

    // Form submission routes
    case '/api/submit-update':
        if ($requestMethod === 'POST') {
            require_once 'endpoints/submit_update.php';
        }
        break;

    case '/api/donate':
        if ($requestMethod === 'POST') {
            require_once 'endpoints/donate.php';
        }
        break;

    case '/api/feedback':
        if ($requestMethod === 'POST') {
            require_once 'endpoints/feedback.php';
        }
        break;

    // Admin auth routes
    case '/admin/login':
        if ($requestMethod === 'POST') {
            require_once 'endpoints/admin_login.php';
        }
        break;

    case '/admin/logout':
        if ($requestMethod === 'POST') {
            require_once 'endpoints/admin_logout.php';
        }
        break;

    case '/admin/status':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_status.php';
        }
        break;

    // Admin routes
    case '/admin/feedback':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_feedback.php';
        }
        break;

    case (preg_match('/^\/admin\/feedback\/(\d+)$/', $path, $matches) ? true : false):
        $_GET['id'] = $matches[1];
        if ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_feedback_delete.php';
        }
        break;

    case '/admin/submit-updates':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_submit_updates.php';
        }
        break;

    case (preg_match('/^\/admin\/submit-updates\/(\d+)$/', $path, $matches) ? true : false):
        $_GET['id'] = $matches[1];
        if ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_submit_updates_delete.php';
        }
        break;

    case '/admin/donations':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_donations.php';
        }
        break;

    case (preg_match('/^\/admin\/donations\/(\d+)$/', $path, $matches) ? true : false):
        $_GET['id'] = $matches[1];
        if ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_donations_delete.php';
        }
        break;

    case '/admin/videos':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_videos.php';
        } elseif ($requestMethod === 'POST') {
            require_once 'endpoints/admin_videos_create.php';
        }
        break;

    case (preg_match('/^\/admin\/videos\/(\d+)$/', $path, $matches) ? true : false):
        $_GET['id'] = $matches[1];
        if ($requestMethod === 'PUT') {
            require_once 'endpoints/admin_videos_update.php';
        } elseif ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_videos_delete.php';
        }
        break;

    case '/admin/news':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_news.php';
        } elseif ($requestMethod === 'POST') {
            require_once 'endpoints/admin_news_create.php';
        }
        break;

    case (preg_match('/^\/admin\/news\/(\d+)$/', $path, $matches) ? true : false):
        $_GET['id'] = $matches[1];
        if ($requestMethod === 'PUT') {
            require_once 'endpoints/admin_news_update.php';
        } elseif ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_news_delete.php';
        }
        break;

    case '/admin/calendar':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_calendar.php';
        } elseif ($requestMethod === 'POST') {
            require_once 'endpoints/admin_calendar_create.php';
        }
        break;

    case (preg_match('/^\/admin\/calendar\/(\d+)$/', $path, $matches) ? true : false):
        $_GET['id'] = $matches[1];
        if ($requestMethod === 'PUT') {
            require_once 'endpoints/admin_calendar_update.php';
        } elseif ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_calendar_delete.php';
        }
        break;

    case '/admin/locals':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_locals.php';
        } elseif ($requestMethod === 'POST') {
            require_once 'endpoints/admin_locals_create.php';
        }
        break;

    case (preg_match('/^\/admin\/locals\/([^\/]+)$/', $path, $matches) ? true : false):
        $_GET['id'] = $matches[1];
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_locals_detail.php';
        } elseif ($requestMethod === 'PUT') {
            require_once 'endpoints/admin_locals_update.php';
        }
        break;

    case (preg_match('/^\/admin\/locals\/([^\/]+)\/upload$/', $path, $matches) ? true : false):
        $_GET['id'] = $matches[1];
        if ($requestMethod === 'POST') {
            require_once 'endpoints/admin_locals_upload.php';
        }
        break;

    case (preg_match('/^\/admin\/pillars\/(.+)$/', $path, $matches) ? true : false):
        $_GET['localId'] = $matches[1];
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_pillars.php';
        }
        break;

    case '/admin/pillars':
        if ($requestMethod === 'PUT') {
            require_once 'endpoints/admin_pillars_update.php';
        } elseif ($requestMethod === 'POST') {
            require_once 'endpoints/admin_pillars_create.php';
        }
        break;

    case '/admin/pillar-programs':
        if ($requestMethod === 'POST') {
            require_once 'endpoints/admin_pillar_programs_create.php';
        }
        break;

    case (preg_match('/^\/admin\/pillar-programs\/(\d+)$/', $path, $matches) ? true : false):
        $_GET['id'] = $matches[1];
        if ($requestMethod === 'PUT') {
            require_once 'endpoints/admin_pillar_programs_update.php';
        } elseif ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_pillar_programs_delete.php';
        }
        break;

    case '/admin/staff':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_staff.php';
        } elseif ($requestMethod === 'POST') {
            require_once 'endpoints/admin_staff_create.php';
        }
        break;

    case (preg_match('/^\/admin\/staff\/(\d+)$/', $path, $matches) ? true : false):
        $_GET['id'] = $matches[1];
        if ($requestMethod === 'PUT') {
            require_once 'endpoints/admin_staff_update.php';
        } elseif ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_staff_delete.php';
        }
        break;

    // Admin facilities routes
    case (preg_match('/^\/admin\/facilities\/([^\/]+)$/', $path, $matches) ? true : false):
        $_GET['localId'] = $matches[1];
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_facilities.php';
        } elseif ($requestMethod === 'POST') {
            require_once 'endpoints/admin_facilities_create.php';
        }
        break;

    case (preg_match('/^\/admin\/facilities\/([^\/]+)\/upload$/', $path, $matches) ? true : false):
        $_GET['localId'] = $matches[1];
        if ($requestMethod === 'POST') {
            require_once 'endpoints/admin_facilities_upload.php';
        }
        break;

    case (preg_match('/^\/admin\/facilities\/([^\/]+)\/images\/(\d+)$/', $path, $matches) ? true : false):
        $_GET['localId'] = $matches[1];
        $_GET['imageId'] = $matches[2];
        if ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_facilities_delete_image.php';
        }
        break;

    // Public facilities endpoint
    case (preg_match('/^\/api\/facilities\/([^\/]+)$/', $path, $matches) ? true : false):
        $_GET['localId'] = $matches[1];
        if ($requestMethod === 'GET') {
            require_once 'endpoints/facilities.php';
        }
        break;

    // Test database route
    case '/test-db':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/test_db.php';
        }
        break;

    case '/test-article':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/test_article.php';
        }
        break;

    // Diagnostic and testing routes
    case '/diagnose':
        if ($requestMethod === 'GET') {
            require_once 'diagnose.php';
        }
        break;

    case '/database-init':
        if ($requestMethod === 'GET' || $requestMethod === 'POST') {
            require_once 'database-init.php';
        }
        break;

    case '/test-data-receipt':
        if ($requestMethod === 'GET' || $requestMethod === 'POST' || $requestMethod === 'PUT') {
            require_once 'test-data-receipt.php';
        }
        break;

    case '/test-update':
        if ($requestMethod === 'GET') {
            require_once 'test-update.php';
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}

// Close database connection
$conn->close();
?>