<?php
// DELETE /admin/videos/:id
$id = intval($_GET['id']);

$sql = "DELETE FROM videos WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Video deleted successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>