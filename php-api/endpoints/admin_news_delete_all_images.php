<?php
// DELETE /admin/news/:newsId/images/all
// Delete all slideshow images for a news article

$newsId = $conn->real_escape_string($_GET['newsId']);

// Check if news exists
$newsResult = $conn->query("SELECT id FROM news WHERE id = $newsId");
if (!$newsResult || $newsResult->num_rows === 0) {
    sendResponse(['error' => 'News article not found'], 404);
    exit;
}

// Delete all images for this news article
$sql = "DELETE FROM news_images WHERE news_id = $newsId";

if ($conn->query($sql) === TRUE) {
    sendResponse([
        'message' => 'All slideshow images deleted successfully',
        'deleted_count' => $conn->affected_rows
    ]);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>
