<?php
// PUT /admin/pillar-programs/:id
$data = getPostData();
$id = intval($_GET['id']);

$title = isset($data['title']) ? $conn->real_escape_string($data['title']) : '';
$bullets = isset($data['bullets']) ? json_encode($data['bullets']) : '[]';
$sequenceOrder = isset($data['sequenceOrder']) ? intval($data['sequenceOrder']) : 0;

$sql = "UPDATE pillar_programs SET title='$title', bullets='$bullets', sequenceOrder=$sequenceOrder WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Program updated successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>