<?php
// PUT /admin/calendar/:id
error_log('[CALENDAR_UPDATE] Request received for ID: ' . ($_GET['id'] ?? 'MISSING'));
error_log('[CALENDAR_UPDATE] Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'NOT SET'));

$data = getPostData();
error_log('[CALENDAR_UPDATE] Parsed data: ' . json_encode($data));

$id = intval($_GET['id']);

if (!isset($data['title']) || empty($data['title'])) {
    error_log('[CALENDAR_UPDATE] Error: title is required');
    sendResponse(['error' => "Field 'title' is required"], 400);
}
if (!isset($data['startDate']) || empty($data['startDate'])) {
    error_log('[CALENDAR_UPDATE] Error: startDate is required');
    sendResponse(['error' => "Field 'startDate' is required"], 400);
}
if (!isset($data['endDate']) || empty($data['endDate'])) {
    error_log('[CALENDAR_UPDATE] Error: endDate is required');
    sendResponse(['error' => "Field 'endDate' is required"], 400);
}

// Validate date range
$startDate = $data['startDate'];
$endDate = $data['endDate'];
if ($startDate > $endDate) {
    error_log('[CALENDAR_UPDATE] Error: Start date after end date');
    sendResponse(['error' => "Start date cannot be after end date"], 400);
}

// Check if start_date and end_date columns exist
$columnsCheck = $conn->query("SHOW COLUMNS FROM calendar_events LIKE 'start_date'");
if (!$columnsCheck || $columnsCheck->num_rows === 0) {
    error_log('[CALENDAR_UPDATE] CRITICAL: start_date column missing! Migration not applied.');
    sendResponse(['error' => 'Database schema error: start_date column missing. Please run the database migration.'], 500);
}

$title = $conn->real_escape_string($data['title']);
$startDate = $conn->real_escape_string($data['startDate']);
$endDate = $conn->real_escape_string($data['endDate']);
$description = isset($data['description']) ? $conn->real_escape_string($data['description']) : '';

error_log('[CALENDAR_UPDATE] Validated fields for ID ' . $id . ': title=' . $title . ', startDate=' . $startDate . ', endDate=' . $endDate);

// Handle file upload
$imageUrl = isset($data['imageUrl']) ? $conn->real_escape_string($data['imageUrl']) : '';
$uploadedImagePath = handleFileUpload('image');
if ($uploadedImagePath) {
    $imageUrl = $uploadedImagePath;
    error_log('[CALENDAR_UPDATE] File uploaded: ' . $imageUrl);
}

$updateParts = [
    "title='$title'",
    "date='$startDate'",
    "start_date='$startDate'",
    "end_date='$endDate'",
    "description='$description'",
    "imageUrl='$imageUrl'",
];

$updatedAtExists = $conn->query("SHOW COLUMNS FROM calendar_events LIKE 'updated_at'");
if ($updatedAtExists && $updatedAtExists->num_rows > 0) {
    $updateParts[] = 'updated_at=NOW()';
}

$sql = "UPDATE calendar_events SET " . implode(', ', $updateParts) . " WHERE id=$id";

error_log('[CALENDAR_UPDATE] Executing SQL: ' . $sql);

if ($conn->query($sql) === TRUE) {
    error_log('[CALENDAR_UPDATE] SUCCESS: Event ID ' . $id . ' updated');

    sendResponse(['message' => 'Event updated successfully']);
} else {
    sendResponse(['error' => 'Database error: ' . $conn->error], 500);
}
?>