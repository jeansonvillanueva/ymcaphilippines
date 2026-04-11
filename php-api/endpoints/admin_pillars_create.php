<?php
// POST /admin/pillars
$data = getPostData();

validateRequired($data, ['localId', 'key', 'label']);

$localId = $conn->real_escape_string($data['localId']);
$key = $conn->real_escape_string($data['key']);
$label = $conn->real_escape_string($data['label']);
$color = isset($data['color']) ? $conn->real_escape_string($data['color']) : '';

$sql = "INSERT INTO pillars (localId, `key`, label, color) VALUES ('$localId', '$key', '$label', '$color')";

if ($conn->query($sql) === TRUE) {
    sendResponse(['id' => $conn->insert_id, 'message' => 'Pillar created successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>