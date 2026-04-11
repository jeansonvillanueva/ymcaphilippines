<?php
// PUT /admin/news/:id
$data = $_POST;
$id = intval($_GET['id']);

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

$sql = "UPDATE news SET path='$path', title='$title', date='$date', subtitle='$subtitle', body='$body', localYMCA='$localYMCA', imageUrl='$imageUrl', category='$category', topic='$topic' WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'News updated successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}

function createNewsPath($title) {
    $slug = preg_replace('/[^a-z0-9]+/', '_', strtolower(trim($title)));
    $slug = trim($slug, '_');
    return '/news/' . ($slug ?: time());
}
?>