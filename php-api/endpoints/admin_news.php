<?php
// GET /admin/news
$conn = getDatabaseConnection();
error_log('[admin_news] Fetching news from database');
error_log('[admin_news] Request time: ' . date('Y-m-d H:i:s'));
$result = $conn->query("SELECT * FROM news ORDER BY created_at DESC");

if ($result) {
    $news = [];
    while ($row = $result->fetch_assoc()) {
        // Ensure contentBlocks is a valid JSON string
        if (!isset($row['contentBlocks']) || $row['contentBlocks'] === null || $row['contentBlocks'] === '') {
            $row['contentBlocks'] = '[]';
        }
        $news[] = $row;
    }
    error_log('[admin_news] Found ' . count($news) . ' news items');
    if (count($news) > 0) {
        error_log('[admin_news] First news item: ' . json_encode(array_slice($news[0], 0, 3)));
    }
    header('Content-Type: application/json');
    sendResponse($news);
} else {
    error_log('[admin_news] Database error: ' . $conn->error);
    sendResponse(['error' => $conn->error], 500);
}
?>