<?php
// GET /api/news
$conn = getDatabaseConnection();
error_log('[public_news] Fetching news from database');
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
    error_log('[public_news] Found ' . count($news) . ' news items');
    sendResponse($news);
} else {
    error_log('[public_news] Database error: ' . $conn->error);
    sendResponse(['error' => $conn->error], 500);
}
?>