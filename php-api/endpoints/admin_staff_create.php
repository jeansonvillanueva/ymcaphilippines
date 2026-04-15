<?php
// POST /admin/staff
$data = getPostData();

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

$createdAtExists = $conn->query("SHOW COLUMNS FROM staff LIKE 'created_at'");
if ($createdAtExists && $createdAtExists->num_rows > 0) {
    $sql = "INSERT INTO staff (name, position, imageUrl, departmentGroup, sequenceOrder, created_at)
            VALUES ('$name', '$position', '$imageUrl', '$departmentGroup', $sequenceOrder, NOW())";
} else {
    $sql = "INSERT INTO staff (name, position, imageUrl, departmentGroup, sequenceOrder)
            VALUES ('$name', '$position', '$imageUrl', '$departmentGroup', $sequenceOrder)";
}

if ($conn->query($sql) === TRUE) {
    sendResponse(['id' => $conn->insert_id, 'imageUrl' => $imageUrl, 'message' => 'Staff added successfully']);
} else {
    sendResponse(['error' => 'Database error: ' . $conn->error], 500);
}
?>