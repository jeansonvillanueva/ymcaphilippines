<?php
// PUT /admin/videos/:id
$data = getPostData();
$id = intval($_GET['id']);

validateRequired($data, ['title', 'embedUrl']);

$title = $conn->real_escape_string($data['title']);
$description = $conn->real_escape_string($data['description']);
$embedUrl = $conn->real_escape_string($data['embedUrl']);
$videoUrl = $conn->real_escape_string($data['videoUrl']);

$embedColumn = getTableColumn($conn, 'videos', 'embedUrl');
$videoColumn = getTableColumn($conn, 'videos', 'videoUrl');

$updateParts = [
    "title='$title'",
    "description='$description'",
    "$embedColumn='$embedUrl'",
    "$videoColumn='$videoUrl'",
];

$updatedAtExists = $conn->query("SHOW COLUMNS FROM videos LIKE 'updated_at'");
if ($updatedAtExists && $updatedAtExists->num_rows > 0) {
    $updateParts[] = 'updated_at=NOW()';
}

$sql = "UPDATE videos SET " . implode(', ', $updateParts) . " WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Video updated successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>