<?php
// DELETE /admin/pillar-programs/:id
$id = intval($_GET['id']);

$conn->query("DELETE FROM local_program_bullets WHERE program_id=$id");
$sql = "DELETE FROM local_programs WHERE program_id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Program deleted successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>