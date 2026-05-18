<?php
// POST /admin/locals/:id/upload
$id = $conn->real_escape_string($_GET['id']);
$field = isset($_GET['field']) ? $_GET['field'] : '';

$fieldMap = [
    'heroImageUrl' => 'hero_image_url',
    'logoImageUrl' => 'logo_image_url',
];

if (!array_key_exists($field, $fieldMap)) {
    sendResponse(['error' => 'Invalid upload field. Use heroImageUrl or logoImageUrl.'], 400);
}

$dbField = $fieldMap[$field];

$imagePath = handleFileUpload('image');
if (!$imagePath) {
    sendResponse(['error' => 'No file uploaded.'], 400);
}

$existsResult = $conn->query("SELECT 1 FROM `local` WHERE local_id = '$id' LIMIT 1");
if (!$existsResult) {
    sendResponse(['error' => $conn->error], 500);
}

if ($existsResult->num_rows === 0) {
    sendResponse(['error' => 'Local not found'], 404);
}

$sql = "UPDATE `local` SET $dbField='$imagePath' WHERE local_id='$id'";

if ($conn->query($sql) === TRUE) {
    sendResponse(['path' => $imagePath, 'message' => 'Image uploaded successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>