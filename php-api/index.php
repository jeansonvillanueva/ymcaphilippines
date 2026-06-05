<?php
require_once 'config.php';
require_once 'utils.php';
require_once 'auth.php';

// Initialize database connection globally so all endpoints have access to $conn
$conn = getDatabaseConnection();
if ($conn) {
    ensureDatabaseSchema($conn);
}

// Cache the php://input stream globally to avoid consuming it multiple times
global $PHP_INPUT_BUFFER;
$PHP_INPUT_BUFFER = null;

function getPhpInput() {
    global $PHP_INPUT_BUFFER;
    if ($PHP_INPUT_BUFFER === null) {
        $PHP_INPUT_BUFFER = file_get_contents('php://input');
    }
    return $PHP_INPUT_BUFFER;
}

// Get the request URI and method
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

error_log('[INDEX.PHP] === NEW REQUEST ===');
error_log('[INDEX.PHP] Initial REQUEST_METHOD: ' . $requestMethod);
error_log('[INDEX.PHP] REQUEST_URI: ' . $requestUri);
error_log('[INDEX.PHP] CONTENT_TYPE: ' . ($_SERVER['CONTENT_TYPE'] ?? 'NOT SET'));

// EARLY INTERCEPT: Handle news updates from query parameter routing
// This catches requests like: /php-api/index.php?path=/secure-management/v3/.../portal/news/15
if (isset($_GET['path']) && preg_match('/\/news\/(\d+)/', $_GET['path'], $newsIdMatch)) {
    $potentialId = $newsIdMatch[1];
    error_log('[INDEX.PHP EARLY] Found news ID in path: ' . $potentialId . ' from GET[path]=' . $_GET['path']);
    $_GET['id'] = $potentialId;  // Pre-set ID early
}

// Allow HTML forms and FormData to override method via _method field
if ($requestMethod === 'POST') {
    error_log('[INDEX.PHP METHOD-OVERRIDE] POST request detected, checking for _method override...');
    $methodOverrideFound = false;
    
    // Check $_POST first (for regular form submissions)
    if (isset($_POST['_method'])) {
        $override = strtoupper(trim($_POST['_method']));
        if (in_array($override, ['PUT', 'DELETE', 'PATCH'], true)) {
            $requestMethod = $override;
            $_SERVER['REQUEST_METHOD'] = $override;
            $methodOverrideFound = true;
            error_log('[INDEX.PHP METHOD-OVERRIDE] SUCCESS: POST -> ' . $override . ' (from $_POST)');
        }
    }
    
    // For FormData requests, extract from raw input using simple string search
    if (!$methodOverrideFound) {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (strpos($contentType, 'multipart/form-data') !== false) {
            $rawInput = getPhpInput();
            $inputLength = strlen($rawInput);
            error_log('[INDEX.PHP METHOD-OVERRIDE] FormData detected, raw input length: ' . $inputLength);
            
            if (!empty($rawInput) && strpos($rawInput, '_method') !== false) {
                error_log('[INDEX.PHP METHOD-OVERRIDE] Found "_method" string in FormData');
                
                // Find the position of _method
                $methodPos = strpos($rawInput, '_method');
                error_log('[INDEX.PHP METHOD-OVERRIDE] _method position: ' . $methodPos);
                
                // Look for the value after the headers (blank line)
                // Start from the _method position and search forward for double newline
                $searchStart = $methodPos;
                $headerEnd = strpos($rawInput, "\r\n\r\n", $searchStart);
                
                if ($headerEnd === false) {
                    // Try Unix line endings
                    $headerEnd = strpos($rawInput, "\n\n", $searchStart);
                    $lineEnding = "\n";
                } else {
                    $lineEnding = "\r\n";
                }
                
                if ($headerEnd !== false) {
                    // Extract value after the blank line
                    $valueStart = $headerEnd + strlen($lineEnding . $lineEnding);
                    
                    // Find the end of the value (next boundary or blank line)
                    $valueEnd = strpos($rawInput, "\r\n", $valueStart);
                    if ($valueEnd === false) {
                        $valueEnd = strpos($rawInput, "\n", $valueStart);
                    }
                    if ($valueEnd === false) {
                        $valueEnd = strpos($rawInput, "--", $valueStart);
                    }
                    if ($valueEnd === false) {
                        $valueEnd = strlen($rawInput);
                    }
                    
                    $value = trim(substr($rawInput, $valueStart, $valueEnd - $valueStart));
                    $override = strtoupper($value);
                    
                    error_log('[INDEX.PHP METHOD-OVERRIDE] Extracted _method value: "' . $value . '" (uppercase: ' . $override . ')');
                    
                    if (in_array($override, ['PUT', 'DELETE', 'PATCH'], true)) {
                        $requestMethod = $override;
                        $_SERVER['REQUEST_METHOD'] = $override;
                        $methodOverrideFound = true;
                        error_log('[INDEX.PHP METHOD-OVERRIDE] SUCCESS: POST -> ' . $override . ' (from FormData extraction)');
                    } else {
                        error_log('[INDEX.PHP METHOD-OVERRIDE] WARNING: Extracted value "' . $override . '" is not a valid HTTP method');
                    }
                } else {
                    error_log('[INDEX.PHP METHOD-OVERRIDE] ERROR: Could not find blank line after _method field');
                    error_log('[INDEX.PHP METHOD-OVERRIDE] Raw input preview: ' . substr($rawInput, max(0, $methodPos - 50), 300));
                }
            } else {
                error_log('[INDEX.PHP METHOD-OVERRIDE] _method not found in FormData');
            }
        } else {
            error_log('[INDEX.PHP METHOD-OVERRIDE] Not FormData: Content-Type = ' . $contentType);
        }
    }
    
    error_log('[INDEX.PHP METHOD-OVERRIDE] Final REQUEST_METHOD: ' . $requestMethod . ' (override: ' . ($methodOverrideFound ? 'YES' : 'NO') . ')');
}

// Remove query string from URI
$path = parse_url($requestUri, PHP_URL_PATH);

// Support query parameter routing (?path=/...) as fallback for .htaccess issues
if (isset($_GET['path']) && !empty($_GET['path'])) {
    $path = $_GET['path'];
    $pathParts = parse_url($path);
    if (isset($pathParts['query'])) {
        parse_str($pathParts['query'], $pathQueryParams);
        $_GET = array_merge($pathQueryParams, $_GET);
        $path = $pathParts['path'] ?? $path;
    }
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

error_log('[INDEX.PHP] === PATH PROCESSING ===');
error_log('[INDEX.PHP] REQUEST_URI: ' . $_SERVER['REQUEST_URI']);
error_log('[INDEX.PHP] Extracted path: ' . $path);
error_log('[INDEX.PHP] $_GET[path]: ' . ($_GET['path'] ?? 'NOT SET'));

// PRE-EXTRACT ALL IDs FROM PATHS FOR BETTER RELIABILITY
// This ensures IDs are available before routing
$newsUpdateMatches = [];
$newsUpdateRegex = '/^(\/n2r8k5j9m1\/news\/(\d+)|\/admin\/news\/(\d+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/news\/(\d+))$/';
error_log('[INDEX.PHP EXTRACTION] Testing regex on path: ' . $path);
error_log('[INDEX.PHP EXTRACTION] Regex pattern: ' . $newsUpdateRegex);

if (preg_match($newsUpdateRegex, $path, $newsUpdateMatches)) {
    $_GET['id'] = firstNonEmptyMatch($newsUpdateMatches, [2, 3, 4]);
    error_log('[INDEX.PHP EXTRACTION] NEWS UPDATE: Regex MATCHED! Full matches: ' . json_encode($newsUpdateMatches));
    error_log('[INDEX.PHP EXTRACTION] Extracted ID: ' . $_GET['id']);
} else {
    error_log('[INDEX.PHP EXTRACTION] NEWS UPDATE: Regex did NOT match');
    error_log('[INDEX.PHP EXTRACTION] Path length: ' . strlen($path) . ', Path bytes: ' . bin2hex($path));
}

// LOG ALL REQUESTS FOR DEBUGGING
error_log("[INDEX.PHP DEBUG] Request: $requestMethod $path");
error_log("[INDEX.PHP DEBUG] Upload match: " . 
    (preg_match('/^(\/n2r8k5j9m1\/news\/(\d+)\/upload|\/admin\/news\/(\d+)\/upload|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/news\/(\d+)\/upload)$/', $path) ? 'YES' : 'NO'));
error_log("[INDEX.PHP DEBUG] News update match: " . 
    (preg_match('/^(\/n2r8k5j9m1\/news\/(\d+)|\/admin\/news\/(\d+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/news\/(\d+))$/', $path, $testMatches) ? 'YES' : 'NO'));
if (preg_match('/^(\/n2r8k5j9m1\/news\/(\d+)|\/admin\/news\/(\d+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/news\/(\d+))$/', $path, $testMatches)) {
    error_log("[INDEX.PHP DEBUG] News ID would be: " . (firstNonEmptyMatch($testMatches, [2, 3, 4]) ?? 'NONE'));
}

// Protect admin routes unless they are public auth endpoints.
$publicAdminRoutes = [
    '/n2r8k5j9m1/login', '/n2r8k5j9m1/status', '/n2r8k5j9m1/logout',
    '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/login', 
    '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/status', 
    '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/logout',
    '/admin/login', '/admin/status', '/admin/logout'
];

// Diagnostic routes (always accessible)
if ($path === '/diagnose-update') {
    require_once 'diagnose-update.php';
    exit;
}

// Quick diagnostic for news routing - shows state BEFORE switch
if ($path === '/diagnose-news-routing') {
    sendResponse([
        'request_method' => $requestMethod,
        'path' => $path,
        'get_id' => $_GET['id'] ?? 'NOT SET',
        'requestUri' => $_SERVER['REQUEST_URI'],
        'get_path' => $_GET['path'] ?? 'NOT SET',
        'pattern_match' => preg_match('/^(\/n2r8k5j9m1\/news\/\d+|\/admin\/news\/\d+|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/news\/\d+)$/', $path) ? 'YES' : 'NO',
        'handler_will_trigger' => (isset($_GET['id']) && preg_match('/^(\/n2r8k5j9m1\/news\/\d+|\/admin\/news\/\d+|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/news\/\d+)$/', $path) && $requestMethod === 'PUT') ? 'YES' : 'NO',
    ]);
    exit;
}

// Diagnostic endpoint that mimics a real news update request - POST with _method=PUT
if (strpos($path, '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/news/') === 0 && $path === '/diagnose-test-news-update') {
    error_log('[DIAGNOSTIC] Testing news update at path: ' . $path);
    error_log('[DIAGNOSTIC] METHOD: ' . $requestMethod . ', ID: ' . ($_GET['id'] ?? 'NOT SET'));
}

// Diagnostic endpoint to debug news update requests
if ($path === '/diagnose-news-update-request') {
    require_once 'diagnose-news-update-request.php';
    exit;
}

if ((strpos($path, '/n2r8k5j9m1') === 0 || strpos($path, '/secure-management') === 0 || strpos($path, '/admin') === 0) && 
    !in_array($path, $publicAdminRoutes, true)) {
    requireAdminAuth();
}

// HANDLE NEWS UPDATE/DELETE BEFORE SWITCH TO AVOID 404 DEFAULT CASE
// This ensures we don't send 404 headers before attempting the fallback routing
$newsPattern = '/^(\/n2r8k5j9m1\/news\/\d+|\/admin\/news\/\d+|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/news\/\d+)$/';
error_log('[INDEX.PHP PRE-SWITCH DEBUG] Checking news update handler...');
error_log('[INDEX.PHP PRE-SWITCH DEBUG] ID isset: ' . (isset($_GET['id']) ? 'YES (value=' . $_GET['id'] . ')' : 'NO'));
error_log('[INDEX.PHP PRE-SWITCH DEBUG] Path: ' . $path);
error_log('[INDEX.PHP PRE-SWITCH DEBUG] Method: ' . $requestMethod);
error_log('[INDEX.PHP PRE-SWITCH DEBUG] Pattern match: ' . (preg_match($newsPattern, $path) ? 'YES' : 'NO'));

if (isset($_GET['id']) && preg_match($newsPattern, $path)) {
    error_log('[INDEX.PHP] ✓ PRE-SWITCH NEWS HANDLER TRIGGERED!');
    error_log('[INDEX.PHP] ID: ' . $_GET['id'] . ', Method: ' . $requestMethod);
    
    if ($requestMethod === 'PUT') {
        error_log('[INDEX.PHP] → Routing to admin_news_update.php (via PUT)');
        require_once 'endpoints/admin_news_update.php';
        exit;
    } elseif ($requestMethod === 'DELETE') {
        error_log('[INDEX.PHP] → Routing to admin_news_delete.php');
        require_once 'endpoints/admin_news_delete.php';
        exit;
    } elseif ($requestMethod === 'POST') {
        // Check if this is an update attempt (has _method or has update fields like title)
        $data = getPostData();
        $isUpdateAttempt = isset($data['title']) && !empty($data['title']);
        error_log('[INDEX.PHP] POST request detected. Is update attempt: ' . ($isUpdateAttempt ? 'YES' : 'NO'));
        error_log('[INDEX.PHP] POST data keys: ' . implode(', ', array_keys($data)));
        
        if ($isUpdateAttempt) {
            // This looks like an update attempt, treat it as PUT
            error_log('[INDEX.PHP] → Treating POST as update (has title field), routing to admin_news_update.php');
            $_SERVER['REQUEST_METHOD'] = 'PUT';  // Override for the endpoint
            require_once 'endpoints/admin_news_update.php';
            exit;
        }
    } else {
        error_log('[INDEX.PHP] ! Handler triggered but method is ' . $requestMethod . ', expected PUT or DELETE');
    }
} else {
    error_log('[INDEX.PHP] ! Pre-switch handler NOT triggered');
}

// Pillar programs must route before generic /locals/:id (some hosts mis-order switch cases).
$localPillarProgramsPattern = '/^(\/n2r8k5j9m1\/locals\/([^\/]+)\/pillar-programs|\/admin\/locals\/([^\/]+)\/pillar-programs|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/locals\/([^\/]+)\/pillar-programs)$/';
if (preg_match($localPillarProgramsPattern, $path, $pillarRouteMatches)) {
    $_GET['id'] = firstNonEmptyMatch($pillarRouteMatches, [2, 3, 4]);
    if ($requestMethod === 'GET') {
        require_once 'endpoints/admin_locals_pillar_programs_get.php';
        exit;
    }
    if ($requestMethod === 'PUT' || $requestMethod === 'POST') {
        require_once 'endpoints/admin_locals_pillar_programs_save.php';
        exit;
    }
}

// Route the request
switch ($path) {
    // Test route
    case '/':
        if ($requestMethod === 'GET') {
            sendResponse(['message' => 'PHP API is running']);
        }
        break;
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

    case (preg_match('/^\/api\/news\/(\d+)\/images$/', $path, $matches) ? true : false):
        $_GET['newsId'] = $matches[1];
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_news_images.php';
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

    case '/api/stats/community-programs':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/stats_community_programs.php';
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

    // Public documents endpoint
    case '/api/documents':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/documents.php';
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

    case '/api/stripe/create-payment-intent':
        if ($requestMethod === 'POST') {
            require_once 'endpoints/stripe_create_intent.php';
        }
        break;

    case '/api/stripe/confirm-payment':
        if ($requestMethod === 'POST') {
            require_once 'endpoints/stripe_confirm_payment.php';
        }
        break;

    case '/api/feedback':
        if ($requestMethod === 'POST') {
            require_once 'endpoints/feedback.php';
        }
        break;

    // Admin auth routes
    case '/n2r8k5j9m1/login':
    case '/admin/login':
    case '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/login':
        if ($requestMethod === 'POST') {
            require_once 'endpoints/admin_login.php';
        }
        break;

    case '/n2r8k5j9m1/logout':
    case '/admin/logout':
    case '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/logout':
        if ($requestMethod === 'POST') {
            require_once 'endpoints/admin_logout.php';
        }
        break;

    case '/n2r8k5j9m1/status':
    case '/admin/status':
    case '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/status':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_status.php';
        }
        break;

    // Admin routes
    case '/n2r8k5j9m1/feedback':
    case '/admin/feedback':
    case '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/feedback':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_feedback.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/feedback\/(\d+)|\/admin\/feedback\/(\d+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/feedback\/(\d+))$/', $path, $matches) ? true : false):
        $_GET['id'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_feedback_delete.php';
        }
        break;

    case '/n2r8k5j9m1/submit-updates':
    case '/admin/submit-updates':
    case '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/submit-updates':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_submit_updates.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/submit-updates\/(\d+)|\/admin\/submit-updates\/(\d+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/submit-updates\/(\d+))$/', $path, $matches) ? true : false):
        $_GET['id'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_submit_updates_delete.php';
        }
        break;

    case '/n2r8k5j9m1/donations':
    case '/admin/donations':
    case '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/donations':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_donations.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/donations\/(\d+)|\/admin\/donations\/(\d+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/donations\/(\d+))$/', $path, $matches) ? true : false):
        $_GET['id'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_donations_delete.php';
        }
        break;

    case '/n2r8k5j9m1/videos':
    case '/admin/videos':
    case '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/videos':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_videos.php';
        } elseif ($requestMethod === 'POST') {
            require_once 'endpoints/admin_videos_create.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/videos\/(\d+)|\/admin\/videos\/(\d+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/videos\/(\d+))$/', $path, $matches) ? true : false):
        $_GET['id'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'PUT') {
            require_once 'endpoints/admin_videos_update.php';
        } elseif ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_videos_delete.php';
        }
        break;

    case '/n2r8k5j9m1/news':
    case '/admin/news':
    case '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/news':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_news.php';
        } elseif ($requestMethod === 'POST') {
            require_once 'endpoints/admin_news_create.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/news\/(\d+)\/upload|\/admin\/news\/(\d+)\/upload|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/news\/(\d+)\/upload)$/', $path, $matches) ? true : false):
        $_GET['newsId'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        error_log('[INDEX.PHP] NEWS UPLOAD: Setting newsId: ' . $_GET['newsId']);
        if ($requestMethod === 'POST') {
            require_once 'endpoints/admin_news_upload_images.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/news\/(\d+)\/images\/all|\/admin\/news\/(\d+)\/images\/all|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/news\/(\d+)\/images\/all)$/', $path, $matches) ? true : false):
        $_GET['newsId'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_news_delete_all_images.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/news\/(\d+)\/images|\/admin\/news\/(\d+)\/images|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/news\/(\d+)\/images)$/', $path, $matches) ? true : false):
        $_GET['newsId'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_news_images.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/news\/(\d+)\/images\/(\d+)|\/admin\/news\/(\d+)\/images\/(\d+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/news\/(\d+)\/images\/(\d+))$/', $path, $matches) ? true : false):
        $_GET['newsId'] = firstNonEmptyMatch($matches, [2, 4, 6]);
        $_GET['imageId'] = firstNonEmptyMatch($matches, [3, 5, 7]);
        if ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_news_delete_image.php';
        }
        break;

    case '/n2r8k5j9m1/calendar':
    case '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/calendar':
    case '/admin/calendar':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_calendar.php';
        } elseif ($requestMethod === 'POST') {
            require_once 'endpoints/admin_calendar_create.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/calendar\/(\d+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/calendar\/(\d+)|\/admin\/calendar\/(\d+))$/', $path, $matches) ? true : false):
        $_GET['id'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'PUT') {
            require_once 'endpoints/admin_calendar_update.php';
        } elseif ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_calendar_delete.php';
        }
        break;

    case '/n2r8k5j9m1/locals':
    case '/admin/locals':
    case '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/locals':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_locals.php';
        } elseif ($requestMethod === 'POST') {
            require_once 'endpoints/admin_locals_create.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/locals\/([^\/]+)\/pillar-programs|\/admin\/locals\/([^\/]+)\/pillar-programs|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/locals\/([^\/]+)\/pillar-programs)$/', $path, $matches) ? true : false):
        $_GET['id'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_locals_pillar_programs_get.php';
        } elseif ($requestMethod === 'PUT' || $requestMethod === 'POST') {
            require_once 'endpoints/admin_locals_pillar_programs_save.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/locals\/([^\/]+)|\/admin\/locals\/([^\/]+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/locals\/([^\/]+))$/', $path, $matches) ? true : false):
        $_GET['id'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_locals_detail.php';
        } elseif ($requestMethod === 'PUT' || $requestMethod === 'POST') {
            require_once 'endpoints/admin_locals_update.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/locals\/([^\/]+)\/upload|\/admin\/locals\/([^\/]+)\/upload|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/locals\/([^\/]+)\/upload)$/', $path, $matches) ? true : false):
        $_GET['id'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'POST') {
            require_once 'endpoints/admin_locals_upload.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/pillars\/(.+)|\/admin\/pillars\/(.+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/pillars\/(.+))$/', $path, $matches) ? true : false):
        $_GET['localId'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_pillars.php';
        }
        break;

    case '/n2r8k5j9m1/pillars':
    case '/admin/pillars':
    case '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/pillars':
        if ($requestMethod === 'PUT') {
            require_once 'endpoints/admin_pillars_update.php';
        } elseif ($requestMethod === 'POST') {
            require_once 'endpoints/admin_pillars_create.php';
        }
        break;

    case '/n2r8k5j9m1/pillar-programs':
    case '/admin/pillar-programs':
    case '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/pillar-programs':
        if ($requestMethod === 'POST') {
            require_once 'endpoints/admin_pillar_programs_create.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/pillar-programs\/(\d+)|\/admin\/pillar-programs\/(\d+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/pillar-programs\/(\d+))$/', $path, $matches) ? true : false):
        $_GET['id'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'PUT') {
            require_once 'endpoints/admin_pillar_programs_update.php';
        } elseif ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_pillar_programs_delete.php';
        }
        break;

    case '/n2r8k5j9m1/staff':
    case '/admin/staff':
    case '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/staff':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_staff.php';
        } elseif ($requestMethod === 'POST') {
            require_once 'endpoints/admin_staff_create.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/staff\/(\d+)|\/admin\/staff\/(\d+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/staff\/(\d+))$/', $path, $matches) ? true : false):
        $_GET['id'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'PUT') {
            require_once 'endpoints/admin_staff_update.php';
        } elseif ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_staff_delete.php';
        }
        break;

    // Admin facilities routes
    case (preg_match('/^(\/n2r8k5j9m1\/facilities\/([^\/]+)|\/admin\/facilities\/([^\/]+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/facilities\/([^\/]+))$/', $path, $matches) ? true : false):
        $_GET['localId'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_facilities.php';
        } elseif ($requestMethod === 'POST') {
            require_once 'endpoints/admin_facilities_create.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/facilities\/([^\/]+)\/upload|\/admin\/facilities\/([^\/]+)\/upload|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/facilities\/([^\/]+)\/upload)$/', $path, $matches) ? true : false):
        $_GET['localId'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'POST') {
            require_once 'endpoints/admin_facilities_upload.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/facilities\/([^\/]+)\/images\/(\d+)|\/admin\/facilities\/([^\/]+)\/images\/(\d+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/facilities\/([^\/]+)\/images\/(\d+))$/', $path, $matches) ? true : false):
        $_GET['localId'] = firstNonEmptyMatch($matches, [2, 4, 6]);
        $_GET['imageId'] = firstNonEmptyMatch($matches, [3, 5, 7]);
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

    // Admin documents routes
    case '/n2r8k5j9m1/documents':
    case '/admin/documents':
    case '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/documents':
        if ($requestMethod === 'GET') {
            require_once 'endpoints/admin_documents.php';
        } elseif ($requestMethod === 'POST') {
            require_once 'endpoints/admin_documents.php';
        }
        break;

    case (preg_match('/^(\/n2r8k5j9m1\/documents\/(\d+)|\/admin\/documents\/(\d+)|\/secure-management\/v3\/k7n4m9p2q8c1x5j3\/portal\/documents\/(\d+))$/', $path, $matches) ? true : false):
        $_GET['id'] = firstNonEmptyMatch($matches, [2, 3, 4]);
        if ($requestMethod === 'PUT') {
            require_once 'endpoints/admin_documents_update.php';
        } elseif ($requestMethod === 'DELETE') {
            require_once 'endpoints/admin_documents_delete.php';
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
    case '/php-api/database-init':
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
if ($conn instanceof mysqli) {
    $conn->close();
}
?>
