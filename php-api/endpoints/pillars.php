<?php
// GET /api/pillars/:localId
$localId = $conn->real_escape_string($_GET['localId']);

$result = $conn->query("SELECT id, localId, `key`, label, color FROM pillars WHERE localId = '$localId' ORDER BY id");
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