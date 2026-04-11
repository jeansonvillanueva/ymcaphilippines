<?php
// PUT /admin/staff/:id
$data = $_POST;
$id = intval($_GET['id']);

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

$sql = "UPDATE staff SET name='$name', position='$position', imageUrl='$imageUrl', departmentGroup='$departmentGroup', sequenceOrder=$sequenceOrder WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['imageUrl' => $imageUrl, 'message' => 'Staff updated successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>