<?php
// GET /api/news
$result = $conn->query("SELECT * FROM news ORDER BY created_at DESC");
if ($result) {
    $news = [];
    while ($row = $result->fetch_assoc()) {
        $news[] = $row;
    }
    sendResponse($news);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>