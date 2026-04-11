<?php
// POST /admin/locals/:id/upload
$id = $conn->real_escape_string($_GET['id']);
$field = isset($_GET['field']) ? $_GET['field'] : '';

$allowedFields = ['heroImageUrl', 'logoImageUrl'];
if (!in_array($field, $allowedFields)) {
    sendResponse(['error' => 'Invalid upload field. Use heroImageUrl or logoImageUrl.'], 400);
}

$imagePath = handleFileUpload('image');
if (!$imagePath) {
    sendResponse(['error' => 'No file uploaded.'], 400);
}

$sql = "UPDATE locals SET $field='$imagePath' WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
    sendResponse(['path' => $imagePath, 'message' => 'Image uploaded successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>