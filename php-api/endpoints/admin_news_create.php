<?php
// POST /admin/news
$data = getPostData();

error_log('[admin_news_create] Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'not set'));
error_log('[admin_news_create] REQUEST_METHOD: ' . ($_SERVER['REQUEST_METHOD'] ?? 'not set'));
error_log('[admin_news_create] _POST keys: ' . implode(', ', array_keys($_POST)));
error_log('[admin_news_create] _FILES keys: ' . implode(', ', array_keys($_FILES)));

if (!isset($data['title']) || empty(trim($data['title']))) {
    error_log('[admin_news_create] ERROR: Title missing or empty');
    sendResponse(['error' => "Field 'title' is required"], 400);
}

$title = trim($data['title']);
$path = isset($data['path']) && !empty(trim($data['path'])) ? trim($data['path']) : createNewsPath($title);

// Ensure path uniqueness
$originalPath = $path;
$counter = 1;
while (true) {
    $checkStmt = $conn->prepare('SELECT id FROM news WHERE path = ?');
    $checkStmt->bind_param('s', $path);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    $pathTaken = $checkResult && $checkResult->num_rows > 0;
    $checkStmt->close();

    if (!$pathTaken) {
        break;
    }

    $path = $originalPath . '-' . $counter;
    $counter++;
    if ($counter > 100) {
        $path = $originalPath . '-' . time();
        break;
    }
}

$date = isset($data['date']) ? trim($data['date']) : '';
$subtitle = isset($data['subtitle']) ? trim($data['subtitle']) : '';
$body = isset($data['body']) ? $data['body'] : '';
$contentBlocks = isset($data['contentBlocks']) ? $data['contentBlocks'] : '[]';
$localYMCA = isset($data['localYMCA']) ? trim($data['localYMCA']) : '';
$imageUrl = isset($data['imageUrl']) ? sanitizeNewsImageUrl($data['imageUrl']) : '';
$category = isset($data['category']) ? trim($data['category']) : 'News';
$topic = isset($data['topic']) ? trim($data['topic']) : '';

$uploadedImagePath = handleFileUpload('image');
if ($uploadedImagePath) {
    $imageUrl = $uploadedImagePath;
}

$createdAtExists = $conn->query("SHOW COLUMNS FROM news LIKE 'created_at'");
$updatedAtExists = $conn->query("SHOW COLUMNS FROM news LIKE 'updated_at'");
$hasCreatedAt = $createdAtExists && $createdAtExists->num_rows > 0;
$hasUpdatedAt = $updatedAtExists && $updatedAtExists->num_rows > 0;

$columns = ['path', 'title', 'date', 'subtitle', 'imageUrl', 'category', 'topic'];
$placeholders = ['?', '?', '?', '?', '?', '?', '?'];
$types = 'sssssss';
$params = [$path, $title, $date, $subtitle, $imageUrl, $category, $topic];

if ($hasCreatedAt) {
    $columns[] = 'created_at';
    $placeholders[] = 'NOW()';
}

if ($hasUpdatedAt) {
    $columns[] = 'updated_at';
    $placeholders[] = 'NOW()';
}

$columns = array_merge($columns, ['body', 'contentBlocks', 'localYMCA']);
$placeholders = array_merge($placeholders, ['?', '?', '?']);
$types .= 'sss';
$params[] = $body;
$params[] = $contentBlocks;
$params[] = $localYMCA;

$sql = 'INSERT INTO news (' . implode(', ', $columns) . ') VALUES (' . implode(', ', $placeholders) . ')';
$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log('[admin_news_create] Prepare failed: ' . $conn->error);
    sendResponse(['error' => 'Database error: ' . $conn->error], 500);
}

$stmt->bind_param($types, ...$params);
$result = $stmt->execute();
$newId = (int)$stmt->insert_id;
if ($newId <= 0) {
    $newId = (int)$conn->insert_id;
}
$stmtError = $stmt->error;
$stmtErrno = $stmt->errno;
$stmt->close();

if ($result !== false && $newId > 0) {
    $verifyStmt = $conn->prepare('SELECT id, title, path FROM news WHERE id = ?');
    $verifyStmt->bind_param('i', $newId);
    $verifyStmt->execute();
    $verifyResult = $verifyStmt->get_result();

    if ($verifyResult && $verifyResult->num_rows > 0) {
        $row = $verifyResult->fetch_assoc();
        $verifyStmt->close();
        sendResponse(['id' => $newId, 'message' => 'News added successfully', 'title' => $row['title']]);
    }

    $verifyStmt->close();
    sendResponse(['error' => 'Record verification failed after insert'], 500);
}

$error = $stmtError ?: getMysqliError($conn);
error_log('[admin_news_create] INSERT FAILED: ' . $error . ' (errno ' . $stmtErrno . ')');
sendResponse(['error' => 'Database error: ' . $error], 500);

function createNewsPath($title) {
    $slug = preg_replace('/[^a-z0-9]+/', '-', strtolower(trim($title)));
    $slug = trim($slug, '-');
    return '/news/' . ($slug ?: 'news-' . time());
}
?>
