<?php
// DELETE /admin/pillar-programs/:id
$id = intval($_GET['id']);

$sql = "DELETE FROM pillar_programs WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Program deleted successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>