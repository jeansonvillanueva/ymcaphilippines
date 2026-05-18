<?php
// GET /admin/submit-updates
$result = $conn->query("SELECT article_id AS id, name, local_ymca, title, subtitle, article_link, email, message FROM submit_article ORDER BY article_id DESC");
if ($result) {
    $updates = [];
    while ($row = $result->fetch_assoc()) {
        $updates[] = $row;
    }
    sendResponse($updates);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>