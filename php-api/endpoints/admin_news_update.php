<?php
// PUT /admin/news/:id
$data = getPostData();
$id = intval($_GET['id'] ?? 0);

error_log('[admin_news_update] Received PUT data for ID ' . $id . ': ' . json_encode($data));
error_log('[admin_news_update] Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'not set'));
error_log('[admin_news_update] REQUEST_METHOD: ' . ($_SERVER['REQUEST_METHOD'] ?? 'not set'));

if ($id <= 0) {
    error_log('[admin_news_update] ERROR: Invalid ID: ' . $id);
    sendResponse(['error' => 'Invalid news ID'], 400);
}

// Check if the news item exists
$checkExists = $conn->query("SELECT id FROM news WHERE id = $id");
if (!$checkExists || $checkExists->num_rows === 0) {
    error_log('[admin_news_update] ERROR: News item with ID ' . $id . ' not found');
    sendResponse(['error' => 'News item not found'], 404);
}

if (!isset($data['title']) || empty(trim($data['title']))) {
    error_log('[admin_news_update] ERROR: Title missing or empty');
    sendResponse(['error' => "Field 'title' is required"], 400);
}

$title = $conn->real_escape_string(trim($data['title']));
$path = isset($data['path']) && !empty($data['path']) ? $conn->real_escape_string($data['path']) : createNewsPath($title);
$date = isset($data['date']) ? $conn->real_escape_string($data['date']) : '';
$subtitle = isset($data['subtitle']) ? $conn->real_escape_string($data['subtitle']) : '';
$body = isset($data['body']) ? $conn->real_escape_string($data['body']) : '';
$contentBlocks = isset($data['contentBlocks']) ? $conn->real_escape_string($data['contentBlocks']) : '[]';
$localYMCA = isset($data['localYMCA']) ? $conn->real_escape_string($data['localYMCA']) : '';
$imageUrl = isset($data['imageUrl']) ? $conn->real_escape_string($data['imageUrl']) : '';
$category = isset($data['category']) ? $conn->real_escape_string($data['category']) : 'News';
$topic = isset($data['topic']) ? $conn->real_escape_string($data['topic']) : '';

// Handle file upload - allow for both POST and PUT (via _method)
$uploadedImagePath = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST' || (isset($_POST['_method']) && $_POST['_method'] === 'PUT')) {
    $uploadedImagePath = handleFileUpload('image');
}
if ($uploadedImagePath) {
    $imageUrl = $uploadedImagePath;
}

$updateParts = [
    "path='$path'",
    "title='$title'",
    "date='$date'",
    "subtitle='$subtitle'",
    "body='$body'",
    "contentBlocks='$contentBlocks'",
    "localYMCA='$localYMCA'",
    "imageUrl='$imageUrl'",
    "category='$category'",
    "topic='$topic'",
];

$updatedAtExists = $conn->query("SHOW COLUMNS FROM news LIKE 'updated_at'");
if ($updatedAtExists && $updatedAtExists->num_rows > 0) {
    $updateParts[] = 'updated_at=NOW()';
}

$sql = "UPDATE news SET " . implode(', ', $updateParts) . " WHERE id=$id";

error_log('[admin_news_update] SQL: ' . $sql);
$result = $conn->query($sql);

if ($result === TRUE) {
    error_log('[admin_news_update] Update returned true. Affected rows: ' . $conn->affected_rows);
    
    // Verify the record was actually updated
    $verify = $conn->query("SELECT id FROM news WHERE id = $id");
    if ($verify && $verify->num_rows > 0) {
        error_log('[admin_news_update] Verification SUCCESS - record exists');
        sendResponse(['message' => 'News updated successfully']);
    } else {
        error_log('[admin_news_update] Verification FAILED - record not found');
        sendResponse(['error' => 'Record not found in database'], 500);
    }
} else {
    error_log('[admin_news_update] Query FAILED. Error: ' . $conn->error);
    sendResponse(['error' => 'Database error: ' . $conn->error], 500);
}

function createNewsPath($title) {
    $slug = preg_replace('/[^a-z0-9]+/', '_', strtolower(trim($title)));
    $slug = trim($slug, '_');
    return '/news/' . ($slug ?: time());
}
?>