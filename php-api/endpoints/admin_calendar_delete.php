<?php
// DELETE /admin/calendar/:id
$id = intval($_GET['id']);

$sql = "DELETE FROM calendar_events WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Event deleted successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>