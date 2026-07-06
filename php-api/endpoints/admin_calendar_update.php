<?php
// PUT /admin/calendar/:id
error_log('[CALENDAR_UPDATE] Request received for ID: ' . ($_GET['id'] ?? 'MISSING'));
error_log('[CALENDAR_UPDATE] Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'NOT SET'));
error_log('[CALENDAR_UPDATE] _FILES keys: ' . json_encode(array_keys($_FILES)));

$data = getPostData();
error_log('[CALENDAR_UPDATE] Parsed data keys: ' . implode(', ', array_keys($data)));

$id = intval($_GET['id'] ?? $_POST['id'] ?? $data['id'] ?? 0);
if ($id <= 0) {
    $id = getNumericRouteId('calendar');
}

if ($id <= 0) {
    error_log('[CALENDAR_UPDATE] Error: invalid event ID');
    sendResponse(['error' => 'Invalid event ID'], 400);
}

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

$startDate = $data['startDate'];
$endDate = $data['endDate'];
if ($startDate > $endDate) {
    error_log('[CALENDAR_UPDATE] Error: Start date after end date');
    sendResponse(['error' => "Start date cannot be after end date"], 400);
}

$columnsCheck = $conn->query("SHOW COLUMNS FROM calendar_events LIKE 'start_date'");
if (!$columnsCheck || $columnsCheck->num_rows === 0) {
    error_log('[CALENDAR_UPDATE] CRITICAL: start_date column missing! Migration not applied.');
    sendResponse(['error' => 'Database schema error: start_date column missing. Please run the database migration.'], 500);
}

$existingResult = $conn->query("SELECT * FROM calendar_events WHERE id=$id LIMIT 1");
if (!$existingResult || $existingResult->num_rows === 0) {
    sendResponse(['error' => 'Event not found'], 404);
}
$existing = $existingResult->fetch_assoc();

$title = $conn->real_escape_string($data['title']);
$startDate = $conn->real_escape_string($data['startDate']);
$endDate = $conn->real_escape_string($data['endDate']);
$description = isset($data['description']) ? $conn->real_escape_string($data['description']) : '';

error_log('[CALENDAR_UPDATE] Validated fields for ID ' . $id . ': title=' . $title . ', startDate=' . $startDate . ', endDate=' . $endDate);

$imageUrl = isset($data['imageUrl']) ? trim($data['imageUrl']) : '';
if ($imageUrl !== '' && stripos($imageUrl, 'data:') === 0) {
    $imageUrl = '';
}
$imageUrl = $conn->real_escape_string($imageUrl);

$uploadedImagePath = handleFileUpload('image');
if ($uploadedImagePath) {
    $imageUrl = $conn->real_escape_string($uploadedImagePath);
    error_log('[CALENDAR_UPDATE] Image uploaded: ' . $uploadedImagePath);
} elseif ($imageUrl === '') {
    $imageUrl = $conn->real_escape_string($existing['imageUrl'] ?? '');
}

$documentTitle = isset($data['documentTitle']) ? $conn->real_escape_string(trim($data['documentTitle'])) : '';
$documentUrl = isset($data['documentUrl']) ? $conn->real_escape_string($data['documentUrl']) : '';
$documentFileName = isset($data['documentFileName']) ? $conn->real_escape_string($data['documentFileName']) : '';
$documentFileType = isset($data['documentFileType']) ? $conn->real_escape_string($data['documentFileType']) : '';
$documentFileSize = isset($data['documentFileSize']) ? (int)$data['documentFileSize'] : null;

$uploadedDocument = handleDocumentUpload('document');
if ($uploadedDocument) {
    if ($documentTitle === '') {
        sendResponse(['error' => 'Document title is required when uploading a document'], 400);
    }
    $documentUrl = $conn->real_escape_string($uploadedDocument['url']);
    $documentFileName = $conn->real_escape_string($uploadedDocument['name']);
    $documentFileType = $conn->real_escape_string($uploadedDocument['type']);
    $documentFileSize = (int)$uploadedDocument['size'];
    error_log('[CALENDAR_UPDATE] Document uploaded: ' . $uploadedDocument['url']);
} else {
    if ($documentTitle === '') {
        $documentTitle = $conn->real_escape_string($existing['documentTitle'] ?? '');
    }
    if ($documentUrl === '') {
        $documentUrl = $conn->real_escape_string($existing['documentUrl'] ?? '');
    }
    if ($documentFileName === '') {
        $documentFileName = $conn->real_escape_string($existing['documentFileName'] ?? '');
    }
    if ($documentFileType === '') {
        $documentFileType = $conn->real_escape_string($existing['documentFileType'] ?? '');
    }
    if ($documentFileSize === null && isset($existing['documentFileSize'])) {
        $documentFileSize = (int)$existing['documentFileSize'];
    }
}

$updateParts = [
    "title='$title'",
    "date='$startDate'",
    "start_date='$startDate'",
    "end_date='$endDate'",
    "description='$description'",
    "imageUrl='$imageUrl'",
];

$documentColumns = [
    'documentTitle' => $documentTitle !== '' ? "'$documentTitle'" : 'NULL',
    'documentUrl' => $documentUrl !== '' ? "'$documentUrl'" : 'NULL',
    'documentFileName' => $documentFileName !== '' ? "'$documentFileName'" : 'NULL',
    'documentFileType' => $documentFileType !== '' ? "'$documentFileType'" : 'NULL',
    'documentFileSize' => $documentFileSize !== null ? $documentFileSize : 'NULL',
];

foreach ($documentColumns as $column => $value) {
    $columnCheck = $conn->query("SHOW COLUMNS FROM calendar_events LIKE '$column'");
    if ($columnCheck && $columnCheck->num_rows > 0) {
        $updateParts[] = "$column=$value";
    }
}

$updatedAtExists = $conn->query("SHOW COLUMNS FROM calendar_events LIKE 'updated_at'");
if ($updatedAtExists && $updatedAtExists->num_rows > 0) {
    $updateParts[] = 'updated_at=NOW()';
}

$sql = "UPDATE calendar_events SET " . implode(', ', $updateParts) . " WHERE id=$id";

error_log('[CALENDAR_UPDATE] Executing SQL: ' . $sql);

if ($conn->query($sql) === TRUE) {
    error_log('[CALENDAR_UPDATE] SUCCESS: Event ID ' . $id . ' updated');
    sendResponse(['message' => 'Event updated successfully', 'id' => $id]);
}

error_log('[CALENDAR_UPDATE] Database error: ' . $conn->error);
sendResponse(['error' => 'Database error: ' . $conn->error], 500);
?>
