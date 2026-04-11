<?php
// POST /admin/videos
$data = getPostData();

validateRequired($data, ['title']);

$title = $conn->real_escape_string($data['title']);
$description = isset($data['description']) ? $conn->real_escape_string($data['description']) : '';
$embedUrl = isset($data['embedUrl']) ? $conn->real_escape_string($data['embedUrl']) : '';
$videoUrl = isset($data['videoUrl']) ? $conn->real_escape_string($data['videoUrl']) : '';

$sql = "INSERT INTO videos (title, description, embedUrl, videoUrl)
        VALUES ('$title', '$description', '$embedUrl', '$videoUrl')";

if ($conn->query($sql) === TRUE) {
    sendResponse(['id' => $conn->insert_id, 'message' => 'Video added successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>