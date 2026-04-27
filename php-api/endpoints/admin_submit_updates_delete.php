<?php
// DELETE /admin/submit-updates/{id}
$updateId = isset($_GET['id']) ? intval($_GET['id']) : null;

if (!$updateId) {
    sendResponse(['error' => 'Update ID is required'], 400);
    exit;
}

$result = $conn->query("DELETE FROM submit_article WHERE article_id = $updateId");
if ($result) {
    sendResponse(['message' => 'Update submission deleted successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>
