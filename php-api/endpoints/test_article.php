<?php
// GET /test-article
$result = $conn->query("SELECT * FROM submit_article");
if ($result) {
    $articles = [];
    while ($row = $result->fetch_assoc()) {
        $articles[] = $row;
    }
    sendResponse($articles);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>