<?php
// DELETE /admin/pillar-programs/:id
require_once __DIR__ . '/../pillars_helper.php';

$id = intval($_GET['id']);
$bulletsTable = getProgramBulletsTableName($conn);

$conn->query("DELETE FROM $bulletsTable WHERE program_id=$id");
$sql = "DELETE FROM local_programs WHERE program_id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Program deleted successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>
