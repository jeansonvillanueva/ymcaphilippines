<?php
// POST /admin/pillar-programs
require_once __DIR__ . '/../pillars_helper.php';

$data = getPostData();

$pillarId = intval($data['pillarId'] ?? 0);
$title = isset($data['title']) ? $conn->real_escape_string(trim((string)$data['title'])) : '';
$bullets = isset($data['bullets']) && is_array($data['bullets']) ? $data['bullets'] : [];

if ($pillarId <= 0) {
    sendResponse(['error' => 'pillarId is required'], 400);
}

$bulletsTable = getProgramBulletsTableName($conn);
$sql = "INSERT INTO local_programs (pillar_id, title, sequence_order) VALUES ($pillarId, '$title', 0)";

if ($conn->query($sql) === TRUE) {
    $programId = (int)$conn->insert_id;
    $order = 0;
    foreach ($bullets as $bullet) {
        $bulletText = $conn->real_escape_string(trim((string)$bullet));
        if ($bulletText !== '') {
            $conn->query(
                "INSERT INTO $bulletsTable (program_id, bullet_text, sequence_order) VALUES ($programId, '$bulletText', $order)"
            );
            $order++;
        }
    }
    sendResponse(['id' => $programId, 'message' => 'Program added successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>
