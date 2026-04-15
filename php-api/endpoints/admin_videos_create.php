<?php
// POST /admin/videos
$data = getPostData();

validateRequired($data, ['title', 'embedUrl']);

$title = $conn->real_escape_string($data['title']);
$description = isset($data['description']) ? $conn->real_escape_string($data['description']) : '';
$embedUrl = isset($data['embedUrl']) ? $conn->real_escape_string($data['embedUrl']) : '';
$videoUrl = isset($data['videoUrl']) ? $conn->real_escape_string($data['videoUrl']) : '';

$embedColumn = getTableColumn($conn, 'videos', 'embedUrl');
$videoColumn = getTableColumn($conn, 'videos', 'videoUrl');

$columns = ['title', 'description', $embedColumn, $videoColumn];
$values = ["'$title'", "'$description'", "'$embedUrl'", "'$videoUrl'"];

$createdAtExists = $conn->query("SHOW COLUMNS FROM videos LIKE 'created_at'");
if ($createdAtExists && $createdAtExists->num_rows > 0) {
    $columns[] = 'created_at';
    $values[] = 'NOW()';
}

$updatedAtExists = $conn->query("SHOW COLUMNS FROM videos LIKE 'updated_at'");
if ($updatedAtExists && $updatedAtExists->num_rows > 0) {
    $columns[] = 'updated_at';
    $values[] = 'NOW()';
}

$sql = "INSERT INTO videos (" . implode(', ', $columns) . ") VALUES (" . implode(', ', $values) . ")";

if ($conn->query($sql) === TRUE) {
    sendResponse(['id' => $conn->insert_id, 'message' => 'Video added successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>