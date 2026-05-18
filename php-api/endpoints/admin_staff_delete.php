<?php
// DELETE /admin/staff/:id
$id = intval($_GET['id']);

$sql = "DELETE FROM staff WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Staff deleted successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>