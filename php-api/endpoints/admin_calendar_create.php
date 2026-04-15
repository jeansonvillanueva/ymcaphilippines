<?php
// POST /admin/calendar
$data = getPostData();

if (!isset($data['title']) || empty($data['title'])) {
    sendResponse(['error' => "Field 'title' is required"], 400);
}
if (!isset($data['date']) || empty($data['date'])) {
    sendResponse(['error' => "Field 'date' is required"], 400);
}

$title = $conn->real_escape_string($data['title']);
$date = $conn->real_escape_string($data['date']);
$description = isset($data['description']) ? $conn->real_escape_string($data['description']) : '';

// Handle file upload
$imageUrl = isset($data['imageUrl']) ? $conn->real_escape_string($data['imageUrl']) : '';
$uploadedImagePath = handleFileUpload('image');
if ($uploadedImagePath) {
    $imageUrl = $uploadedImagePath;
}

$createdAtExists = $conn->query("SHOW COLUMNS FROM calendar_events LIKE 'created_at'");
if ($createdAtExists && $createdAtExists->num_rows > 0) {
    $sql = "INSERT INTO calendar_events (title, date, description, imageUrl, created_at)
            VALUES ('$title', '$date', '$description', '$imageUrl', NOW())";
} else {
    $sql = "INSERT INTO calendar_events (title, date, description, imageUrl)
            VALUES ('$title', '$date', '$description', '$imageUrl')";
}

if ($conn->query($sql) === TRUE) {
    sendResponse(['id' => $conn->insert_id, 'message' => 'Event added successfully']);
} else {
    sendResponse(['error' => 'Database error: ' . $conn->error], 500);
}
?>