<?php
// POST /admin/pillar-programs
$data = getPostData();

$pillarId = intval($data['pillarId']);
$title = isset($data['title']) ? $conn->real_escape_string($data['title']) : '';
$bullets = isset($data['bullets']) && is_array($data['bullets']) ? $data['bullets'] : [];

$sql = "INSERT INTO local_programs (pillar_id, title) VALUES ($pillarId, '$title')";

if ($conn->query($sql) === TRUE) {
    $programId = $conn->insert_id;
    foreach ($bullets as $bullet) {
        $bulletText = $conn->real_escape_string((string)$bullet);
        if ($bulletText !== '') {
            $conn->query("INSERT INTO local_program_bullets (program_id, bullet_text) VALUES ($programId, '$bulletText')");
        }
    }
    sendResponse(['id' => $programId, 'message' => 'Program added successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>