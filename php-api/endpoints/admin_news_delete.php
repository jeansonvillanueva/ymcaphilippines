<?php
// DELETE /admin/news/:id
$id = intval($_GET['id']);

$sql = "DELETE FROM news WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'News deleted successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>