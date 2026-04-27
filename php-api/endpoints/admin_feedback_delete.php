<?php
// DELETE /admin/feedback/{id}
$feedbackId = isset($_GET['id']) ? intval($_GET['id']) : null;

if (!$feedbackId) {
    sendResponse(['error' => 'Feedback ID is required'], 400);
    exit;
}

$result = $conn->query("DELETE FROM feedback WHERE feedback_id = $feedbackId");
if ($result) {
    sendResponse(['message' => 'Feedback deleted successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>
