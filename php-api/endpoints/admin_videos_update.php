<?php
// PUT /admin/videos/:id
$data = getPostData();
$id = intval($_GET['id']);

$title = $conn->real_escape_string($data['title']);
$description = $conn->real_escape_string($data['description']);
$embedUrl = $conn->real_escape_string($data['embedUrl']);
$videoUrl = $conn->real_escape_string($data['videoUrl']);

$sql = "UPDATE videos SET title='$title', description='$description', embedUrl='$embedUrl', videoUrl='$videoUrl' WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Video updated successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>