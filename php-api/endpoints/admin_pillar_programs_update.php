<?php
// PUT /admin/pillar-programs/:id
require_once __DIR__ . '/../pillars_helper.php';

$data = getPostData();
$id = intval($_GET['id']);

$title = isset($data['title']) ? $conn->real_escape_string(trim((string)$data['title'])) : '';
$bullets = isset($data['bullets']) && is_array($data['bullets']) ? $data['bullets'] : [];
$bulletsTable = getProgramBulletsTableName($conn);

$sql = "UPDATE local_programs SET title='$title' WHERE program_id=$id";

if ($conn->query($sql) === TRUE) {
    $conn->query("DELETE FROM $bulletsTable WHERE program_id=$id");
    $order = 0;
    foreach ($bullets as $bullet) {
        $bulletText = $conn->real_escape_string(trim((string)$bullet));
        if ($bulletText !== '') {
            $conn->query(
                "INSERT INTO $bulletsTable (program_id, bullet_text, sequence_order) VALUES ($id, '$bulletText', $order)"
            );
            $order++;
        }
    }
    sendResponse(['message' => 'Program updated successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>
