<?php
// POST /admin/news
$data = $_POST;

validateRequired($data, ['title']);

$title = $conn->real_escape_string($data['title']);
$path = isset($data['path']) && !empty($data['path']) ? $conn->real_escape_string($data['path']) : createNewsPath($title);
$date = isset($data['date']) ? $conn->real_escape_string($data['date']) : '';
$subtitle = isset($data['subtitle']) ? $conn->real_escape_string($data['subtitle']) : '';
$body = isset($data['body']) ? $conn->real_escape_string($data['body']) : '';
$localYMCA = isset($data['localYMCA']) ? $conn->real_escape_string($data['localYMCA']) : '';
$imageUrl = isset($data['imageUrl']) ? $conn->real_escape_string($data['imageUrl']) : '';
$category = isset($data['category']) ? $conn->real_escape_string($data['category']) : '';
$topic = isset($data['topic']) ? $conn->real_escape_string($data['topic']) : '';

// Handle file upload
$uploadedImagePath = handleFileUpload('image');
if ($uploadedImagePath) {
    $imageUrl = $uploadedImagePath;
}

$sql = "INSERT INTO news (path, title, date, subtitle, body, localYMCA, imageUrl, category, topic)
        VALUES ('$path', '$title', '$date', '$subtitle', '$body', '$localYMCA', '$imageUrl', '$category', '$topic')";

if ($conn->query($sql) === TRUE) {
    sendResponse(['id' => $conn->insert_id, 'message' => 'News added successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}

function createNewsPath($title) {
    $slug = preg_replace('/[^a-z0-9]+/', '_', strtolower(trim($title)));
    $slug = trim($slug, '_');
    return '/news/' . ($slug ?: time());
}
?>