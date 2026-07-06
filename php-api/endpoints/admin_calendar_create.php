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
$imageUrl = isset($data['imageUrl']) ? trim($data['imageUrl']) : '';
if ($imageUrl !== '' && stripos($imageUrl, 'data:') === 0) {
    $imageUrl = '';
}
$uploadedImagePath = handleFileUpload('image');
if ($uploadedImagePath) {
    $imageUrl = $uploadedImagePath;
    error_log('[CALENDAR_CREATE] File uploaded: ' . $imageUrl);
}
$imageUrl = $conn->real_escape_string($imageUrl);

$documentTitle = isset($data['documentTitle']) ? $conn->real_escape_string(trim($data['documentTitle'])) : '';
$documentUrl = isset($data['documentUrl']) ? $conn->real_escape_string($data['documentUrl']) : '';
$documentFileName = isset($data['documentFileName']) ? $conn->real_escape_string($data['documentFileName']) : '';
$documentFileType = isset($data['documentFileType']) ? $conn->real_escape_string($data['documentFileType']) : '';
$documentFileSize = isset($data['documentFileSize']) ? (int)$data['documentFileSize'] : 'NULL';

$uploadedDocument = handleDocumentUpload('document');
if ($uploadedDocument) {
    if ($documentTitle === '') {
        sendResponse(['error' => 'Document title is required when uploading a document'], 400);
    }
    $documentUrl = $conn->real_escape_string($uploadedDocument['url']);
    $documentFileName = $conn->real_escape_string($uploadedDocument['name']);
    $documentFileType = $conn->real_escape_string($uploadedDocument['type']);
    $documentFileSize = (int)$uploadedDocument['size'];
    error_log('[CALENDAR_CREATE] Document uploaded: ' . $documentUrl);
} elseif ($documentTitle !== '' && $documentUrl === '') {
    sendResponse(['error' => 'Document file is required when a document title is provided'], 400);
} else {
    $documentFileSize = null;
}

$insertColumns = ['title', 'date', 'start_date', 'end_date', 'description', 'imageUrl'];
$insertValues = ["'$title'", "'$startDate'", "'$startDate'", "'$endDate'", "'$description'", "'$imageUrl'"];

$documentFields = [
    'documentTitle' => $documentTitle !== '' ? "'$documentTitle'" : 'NULL',
    'documentUrl' => $documentUrl !== '' ? "'$documentUrl'" : 'NULL',
    'documentFileName' => $documentFileName !== '' ? "'$documentFileName'" : 'NULL',
    'documentFileType' => $documentFileType !== '' ? "'$documentFileType'" : 'NULL',
    'documentFileSize' => $documentFileSize !== null ? $documentFileSize : 'NULL',
];

foreach ($documentFields as $column => $value) {
    $columnCheck = $conn->query("SHOW COLUMNS FROM calendar_events LIKE '$column'");
    if ($columnCheck && $columnCheck->num_rows > 0) {
        $insertColumns[] = $column;
        $insertValues[] = $value;
    }
}

$createdAtExists = $conn->query("SHOW COLUMNS FROM calendar_events LIKE 'created_at'");
if ($createdAtExists && $createdAtExists->num_rows > 0) {
    $insertColumns[] = 'created_at';
    $insertValues[] = 'NOW()';
}

$sql = 'INSERT INTO calendar_events (' . implode(', ', $insertColumns) . ') VALUES (' . implode(', ', $insertValues) . ')';

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