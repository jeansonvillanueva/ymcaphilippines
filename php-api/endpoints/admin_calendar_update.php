<?php
// PUT /admin/calendar/:id
$data = $_POST;
$id = intval($_GET['id']);

$title = $conn->real_escape_string($data['title']);
$date = $conn->real_escape_string($data['date']);
$description = isset($data['description']) ? $conn->real_escape_string($data['description']) : '';

// Handle file upload
$imageUrl = isset($data['imageUrl']) ? $conn->real_escape_string($data['imageUrl']) : '';
$uploadedImagePath = handleFileUpload('image');
if ($uploadedImagePath) {
    $imageUrl = $uploadedImagePath;
}

$sql = "UPDATE calendar_events SET title='$title', date='$date', description='$description', imageUrl='$imageUrl' WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Event updated successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>