<?php
// GET /api/news
error_log('[public_news] Fetching news from database');
$result = $conn->query("SELECT * FROM news ORDER BY created_at DESC");

if ($result) {
    $news = [];
    while ($row = $result->fetch_assoc()) {
        $news[] = $row;
    }
    error_log('[public_news] Found ' . count($news) . ' news items');
    sendResponse($news);
} else {
    error_log('[public_news] Database error: ' . $conn->error);
    sendResponse(['error' => $conn->error], 500);
}
?>