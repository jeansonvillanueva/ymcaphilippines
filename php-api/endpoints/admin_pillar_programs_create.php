<?php
// POST /admin/pillar-programs
$data = getPostData();

$pillarId = intval($data['pillarId']);
$title = isset($data['title']) ? $conn->real_escape_string($data['title']) : '';
$bullets = isset($data['bullets']) ? json_encode($data['bullets']) : '[]';
$sequenceOrder = isset($data['sequenceOrder']) ? intval($data['sequenceOrder']) : 0;

$sql = "INSERT INTO pillar_programs (pillarId, title, bullets, sequenceOrder) VALUES ($pillarId, '$title', '$bullets', $sequenceOrder)";

if ($conn->query($sql) === TRUE) {
    sendResponse(['id' => $conn->insert_id, 'message' => 'Program added successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>