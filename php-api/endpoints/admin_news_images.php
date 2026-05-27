<?php
// GET /admin/news/:newsId/images
$newsId = $conn->real_escape_string($_GET['newsId']);

// Check if news exists
$newsResult = $conn->query("SELECT id FROM news WHERE id = $newsId");
if (!$newsResult || $newsResult->num_rows === 0) {
    sendResponse(['error' => 'News article not found'], 404);
    exit;
}

// Fetch all images for this news article ordered by image_order
$result = $conn->query("SELECT id, news_id, image_url, image_order, created_at FROM news_images WHERE news_id = $newsId ORDER BY image_order ASC");

if ($result) {
    $images = [];
    while ($row = $result->fetch_assoc()) {
        $images[] = $row;
    }
    sendResponse($images);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>
