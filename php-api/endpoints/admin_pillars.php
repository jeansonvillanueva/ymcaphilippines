<?php
// GET /admin/pillars/:localId
$localId = $conn->real_escape_string($_GET['localId']);

$result = $conn->query("SELECT pillars_id AS id, local_id AS localId, pillar_key AS `key`, label, color FROM local_pillars WHERE local_id = '$localId' ORDER BY pillars_id");
if ($result) {
    $pillars = [];
    while ($row = $result->fetch_assoc()) {
        $pillars[] = $row;
    }
    sendResponse($pillars);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>