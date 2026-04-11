<?php
// POST /admin/calendar
$data = $_POST;

validateRequired($data, ['title', 'date']);

$title = $conn->real_escape_string($data['title']);
$date = $conn->real_escape_string($data['date']);
$description = isset($data['description']) ? $conn->real_escape_string($data['description']) : '';

// Handle file upload
$imageUrl = isset($data['imageUrl']) ? $conn->real_escape_string($data['imageUrl']) : '';
$uploadedImagePath = handleFileUpload('image');
if ($uploadedImagePath) {
    $imageUrl = $uploadedImagePath;
}

$sql = "INSERT INTO calendar_events (title, date, description, imageUrl)
        VALUES ('$title', '$date', '$description', '$imageUrl')";

if ($conn->query($sql) === TRUE) {
    sendResponse(['id' => $conn->insert_id, 'message' => 'Event added successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>