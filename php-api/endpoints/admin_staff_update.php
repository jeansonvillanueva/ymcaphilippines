<?php
// PUT /admin/staff/:id
$data = getPostData();
$id = intval($_GET['id']);

if (!isset($data['name']) || empty($data['name'])) {
    sendResponse(['error' => "Field 'name' is required"], 400);
}
if (!isset($data['position']) || empty($data['position'])) {
    sendResponse(['error' => "Field 'position' is required"], 400);
}

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

$updateParts = [
    "name='$name'",
    "position='$position'",
    "imageUrl='$imageUrl'",
    "departmentGroup='$departmentGroup'",
    "sequenceOrder=$sequenceOrder",
];

$updatedAtExists = $conn->query("SHOW COLUMNS FROM staff LIKE 'updated_at'");
if ($updatedAtExists && $updatedAtExists->num_rows > 0) {
    $updateParts[] = 'updated_at=NOW()';
}

$sql = "UPDATE staff SET " . implode(', ', $updateParts) . " WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['imageUrl' => $imageUrl, 'message' => 'Staff updated successfully']);
} else {
    sendResponse(['error' => 'Database error: ' . $conn->error], 500);
}
?>