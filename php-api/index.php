<?php
require_once 'config.php';
require_once 'utils.php';

// Get the request URI and method
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove query string from URI
$path = parse_url($requestUri, PHP_URL_PATH);

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

    // Admin routes
    case '/admin/feedback':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_feedback.php';
        }
        break;

    case '/admin/submit-updates':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_submit_updates.php';
        }
        break;

    case '/admin/donations':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_donations.php';
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

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}

// Close database connection
$conn->close();
?>