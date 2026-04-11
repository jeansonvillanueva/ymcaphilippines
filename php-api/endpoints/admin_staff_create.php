<?php
// POST /admin/staff
$data = $_POST;

validateRequired($data, ['name', 'position']);

$name = $conn->real_escape_string($data['name']);
$position = $conn->real_escape_string($data['position']);
$imageUrl = isset($data['imageUrl']) ? $conn->real_escape_string($data['imageUrl']) : '';
$departmentGroup = isset($data['departmentGroup']) ? $conn->real_escape_string($data['departmentGroup']) : '';
$sequenceOrder = isset($data['sequenceOrder']) ? intval($data['sequenceOrder']) : 0;

// Handle file upload
$uploadedImagePath = handleFileUpload('photo');
if ($uploadedImagePath) {
    $imageUrl = $uploadedImagePath;
}

$sql = "INSERT INTO staff (name, position, imageUrl, departmentGroup, sequenceOrder)
        VALUES ('$name', '$position', '$imageUrl', '$departmentGroup', $sequenceOrder)";

if ($conn->query($sql) === TRUE) {
    sendResponse(['id' => $conn->insert_id, 'imageUrl' => $imageUrl, 'message' => 'Staff added successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>