<?php
// PUT /admin/calendar/:id
$data = getPostData();
$id = intval($_GET['id']);

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

$updateParts = [
    "title='$title'",
    "date='$date'",
    "description='$description'",
    "imageUrl='$imageUrl'",
];

$updatedAtExists = $conn->query("SHOW COLUMNS FROM calendar_events LIKE 'updated_at'");
if ($updatedAtExists && $updatedAtExists->num_rows > 0) {
    $updateParts[] = 'updated_at=NOW()';
}

$sql = "UPDATE calendar_events SET " . implode(', ', $updateParts) . " WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Event updated successfully']);
} else {
    sendResponse(['error' => 'Database error: ' . $conn->error], 500);
}
?>