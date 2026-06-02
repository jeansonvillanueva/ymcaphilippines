<?php
// GET /api/news
require_once __DIR__ . '/../utils/news_date.php';

$conn = getDatabaseConnection();
error_log('[public_news] Fetching news from database');

header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

$result = $conn->query('SELECT * FROM news');

if ($result) {
    $news = [];
    while ($row = $result->fetch_assoc()) {
        // Ensure contentBlocks is a valid JSON string
        if (!isset($row['contentBlocks']) || $row['contentBlocks'] === null || $row['contentBlocks'] === '') {
            $row['contentBlocks'] = '[]';
        }
        // Normalize `date` key for clients (MySQL column is `date`)
        $displayDate = getNewsRowDate($row);
        if ($displayDate !== null) {
            $row['date'] = $displayDate;
        }
        $news[] = $row;
    }

    $news = sortNewsRowsByDateDesc($news);

    error_log('[public_news] Found ' . count($news) . ' news items (sorted by display date)');
    sendResponse($news);
} else {
    error_log('[public_news] Database error: ' . $conn->error);
    sendResponse(['error' => $conn->error], 500);
}
?>
