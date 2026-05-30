<?php
// PUT /admin/news/:id
$data = getPostData();

error_log('[admin_news_update] $_GET[id]: ' . ($_GET['id'] ?? 'NOT SET'));
error_log('[admin_news_update] $_POST[id]: ' . ($_POST['id'] ?? 'NOT SET'));
error_log('[admin_news_update] $data[id]: ' . ($data['id'] ?? 'NOT SET'));

$id = intval($_GET['id'] ?? $_POST['id'] ?? $data['id'] ?? 0);
if ($id <= 0) {
    $id = getNumericRouteId('news');
}

error_log('[admin_news_update] Final ID after intval: ' . $id);
error_log('[admin_news_update] Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'not set'));
error_log('[admin_news_update] REQUEST_METHOD: ' . ($_SERVER['REQUEST_METHOD'] ?? 'not set'));

if ($id <= 0) {
    error_log('[admin_news_update] ERROR: Invalid ID: ' . $id);
    sendResponse(['error' => 'Invalid news ID'], 400);
}

$checkStmt = $conn->prepare('SELECT id, imageUrl, path FROM news WHERE id = ?');
$checkStmt->bind_param('i', $id);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if (!$checkResult || $checkResult->num_rows === 0) {
    error_log('[admin_news_update] ERROR: News item with ID ' . $id . ' not found');
    sendResponse(['error' => 'News item not found'], 404);
}

$existingNews = $checkResult->fetch_assoc();
$checkStmt->close();

if (!isset($data['title']) || empty(trim($data['title']))) {
    error_log('[admin_news_update] ERROR: Title missing or empty');
    sendResponse(['error' => "Field 'title' is required"], 400);
}

$title = trim($data['title']);
$path = isset($data['path']) && !empty(trim($data['path']))
    ? trim($data['path'])
    : ($existingNews['path'] ?? '');
if ($path === '') {
    $path = createNewsPath($title);
}

$date = isset($data['date']) ? trim($data['date']) : '';
$subtitle = isset($data['subtitle']) ? trim($data['subtitle']) : '';
$body = isset($data['body']) ? $data['body'] : '';
$contentBlocks = isset($data['contentBlocks']) ? $data['contentBlocks'] : '[]';
$localYMCA = isset($data['localYMCA']) ? trim($data['localYMCA']) : '';
$imageUrl = array_key_exists('imageUrl', $data)
    ? sanitizeNewsImageUrl($data['imageUrl'])
    : ($existingNews['imageUrl'] ?? '');
$category = isset($data['category']) ? trim($data['category']) : 'News';
$topic = isset($data['topic']) ? trim($data['topic']) : '';

// Handle file upload - allow for both POST and PUT (via _method)
$uploadedImagePath = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST' || (isset($_POST['_method']) && $_POST['_method'] === 'PUT')) {
    $uploadedImagePath = handleFileUpload('image');
}
if ($uploadedImagePath) {
    $imageUrl = $uploadedImagePath;
}

$updatedAtExists = $conn->query("SHOW COLUMNS FROM news LIKE 'updated_at'");
$hasUpdatedAt = $updatedAtExists && $updatedAtExists->num_rows > 0;

if ($hasUpdatedAt) {
    $sql = 'UPDATE news SET path=?, title=?, date=?, subtitle=?, body=?, contentBlocks=?, localYMCA=?, imageUrl=?, category=?, topic=?, updated_at=NOW() WHERE id=?';
} else {
    $sql = 'UPDATE news SET path=?, title=?, date=?, subtitle=?, body=?, contentBlocks=?, localYMCA=?, imageUrl=?, category=?, topic=? WHERE id=?';
}

$stmt = $conn->prepare($sql);
if (!$stmt) {
    error_log('[admin_news_update] Prepare failed: ' . $conn->error);
    sendResponse(['error' => 'Database error: ' . $conn->error], 500);
}

$stmt->bind_param(
    'ssssssssssi',
    $path,
    $title,
    $date,
    $subtitle,
    $body,
    $contentBlocks,
    $localYMCA,
    $imageUrl,
    $category,
    $topic,
    $id
);

$result = $stmt->execute();
$stmtError = $stmt->error;
$stmt->close();

if ($result) {
    error_log('[admin_news_update] Update succeeded. Affected rows: ' . $conn->affected_rows);

    $verify = $conn->query("SELECT id FROM news WHERE id = $id");
    if ($verify && $verify->num_rows > 0) {
        sendResponse(['message' => 'News updated successfully']);
    } else {
        sendResponse(['error' => 'Record not found in database'], 500);
    }
} else {
    $error = $stmtError ?: getMysqliError($conn);
    error_log('[admin_news_update] Execute failed: ' . $error);
    sendResponse(['error' => 'Database error: ' . $error], 500);
}

function createNewsPath($title) {
    $slug = preg_replace('/[^a-z0-9]+/', '_', strtolower(trim($title)));
    $slug = trim($slug, '_');
    return '/news/' . ($slug ?: time());
}
?>
