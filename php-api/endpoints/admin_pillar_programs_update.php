<?php
// PUT /admin/pillar-programs/:id
$data = getPostData();
$id = intval($_GET['id']);

$title = isset($data['title']) ? $conn->real_escape_string($data['title']) : '';
$bullets = isset($data['bullets']) && is_array($data['bullets']) ? $data['bullets'] : [];

$sql = "UPDATE local_programs SET title='$title' WHERE program_id=$id";

if ($conn->query($sql) === TRUE) {
    $conn->query("DELETE FROM local_program_bullets WHERE program_id=$id");
    foreach ($bullets as $bullet) {
        $bulletText = $conn->real_escape_string((string)$bullet);
        if ($bulletText !== '') {
            $conn->query("INSERT INTO local_program_bullets (program_id, bullet_text) VALUES ($id, '$bulletText')");
        }
    }
    sendResponse(['message' => 'Program updated successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>