<?php
// POST /admin/calendar
error_log('[CALENDAR_CREATE] Request received');
error_log('[CALENDAR_CREATE] Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'NOT SET'));
error_log('[CALENDAR_CREATE] _POST: ' . json_encode($_POST));
error_log('[CALENDAR_CREATE] _FILES: ' . json_encode(array_keys($_FILES)));

$data = getPostData();
error_log('[CALENDAR_CREATE] Parsed data: ' . json_encode($data));

// Check if required fields are present
if (!isset($data['title']) || empty($data['title'])) {
    error_log('[CALENDAR_CREATE] Error: title is required');
    sendResponse(['error' => "Field 'title' is required"], 400);
}
if (!isset($data['startDate']) || empty($data['startDate'])) {
    error_log('[CALENDAR_CREATE] Error: startDate is required. Data keys: ' . implode(', ', array_keys($data)));
    sendResponse(['error' => "Field 'startDate' is required"], 400);
}
if (!isset($data['endDate']) || empty($data['endDate'])) {
    error_log('[CALENDAR_CREATE] Error: endDate is required');
    sendResponse(['error' => "Field 'endDate' is required"], 400);
}

// Validate date range
$startDate = $data['startDate'];
$endDate = $data['endDate'];
if ($startDate > $endDate) {
    error_log('[CALENDAR_CREATE] Error: Start date after end date');
    sendResponse(['error' => "Start date cannot be after end date"], 400);
}

// Check if start_date and end_date columns exist
$columnsCheck = $conn->query("SHOW COLUMNS FROM calendar_events LIKE 'start_date'");
if (!$columnsCheck || $columnsCheck->num_rows === 0) {
    error_log('[CALENDAR_CREATE] CRITICAL: start_date column missing! Migration not applied.');
    sendResponse(['error' => 'Database schema error: start_date column missing. Please run the database migration.'], 500);
}

$title = $conn->real_escape_string($data['title']);
$startDate = $conn->real_escape_string($data['startDate']);
$endDate = $conn->real_escape_string($data['endDate']);
$description = isset($data['description']) ? $conn->real_escape_string($data['description']) : '';

error_log('[CALENDAR_CREATE] Validated fields: title=' . $title . ', startDate=' . $startDate . ', endDate=' . $endDate);

// Handle file upload
$imageUrl = isset($data['imageUrl']) ? $conn->real_escape_string($data['imageUrl']) : '';
$uploadedImagePath = handleFileUpload('image');
if ($uploadedImagePath) {
    $imageUrl = $uploadedImagePath;
    error_log('[CALENDAR_CREATE] File uploaded: ' . $imageUrl);
}

// Check if created_at column exists for the insert statement
$createdAtExists = $conn->query("SHOW COLUMNS FROM calendar_events LIKE 'created_at'");
if ($createdAtExists && $createdAtExists->num_rows > 0) {
    $sql = "INSERT INTO calendar_events (title, date, start_date, end_date, description, imageUrl, created_at)
            VALUES ('$title', '$startDate', '$startDate', '$endDate', '$description', '$imageUrl', NOW())";
} else {
    $sql = "INSERT INTO calendar_events (title, date, start_date, end_date, description, imageUrl)
            VALUES ('$title', '$startDate', '$startDate', '$endDate', '$description', '$imageUrl')";
}

error_log('[CALENDAR_CREATE] Executing SQL: ' . $sql);

if ($conn->query($sql) === TRUE) {
    $newId = $conn->insert_id;
    error_log('[CALENDAR_CREATE] SUCCESS: Event added with ID ' . $newId);
    
    // Verify the insert by querying back the row
    $verifyResult = $conn->query("SELECT * FROM calendar_events WHERE id=$newId");
    if ($verifyResult && $verifyResult->num_rows > 0) {
        $verifyRow = $verifyResult->fetch_assoc();
        error_log('[CALENDAR_CREATE] VERIFIED: Row exists in database: ' . json_encode($verifyRow));
    } else {
        error_log('[CALENDAR_CREATE] WARNING: Could not verify inserted row!');
    }
    
    sendResponse(['id' => $newId, 'message' => 'Event added successfully']);
} else {
    $error = $conn->error;
    $errno = $conn->errno;
    error_log('[CALENDAR_CREATE] Database error #' . $errno . ': ' . $error);
    error_log('[CALENDAR_CREATE] Failed SQL: ' . $sql);
    sendResponse(['error' => 'Database error #' . $errno . ': ' . $error], 500);
}
?>