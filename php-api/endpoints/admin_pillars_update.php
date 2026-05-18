<?php
// PUT /admin/pillars/:id
$data = getPostData();
$id = intval($_GET['id']);

$key = $conn->real_escape_string($data['key']);
$label = $conn->real_escape_string($data['label']);
$color = isset($data['color']) ? $conn->real_escape_string($data['color']) : '';

$sql = "UPDATE local_pillars SET pillar_key='$key', label='$label', color='$color' WHERE pillars_id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Pillar updated successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>