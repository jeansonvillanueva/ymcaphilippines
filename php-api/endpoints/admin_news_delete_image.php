<?php
// DELETE /admin/news/:newsId/images/:imageId
$newsId = $conn->real_escape_string($_GET['newsId']);
$imageId = $conn->real_escape_string($_GET['imageId']);

// Check if image exists and belongs to this news article
$result = $conn->query("SELECT image_url FROM news_images WHERE id = $imageId AND news_id = $newsId");
if (!$result || $result->num_rows === 0) {
    sendResponse(['error' => 'Image not found'], 404);
    exit;
}

// Delete the database record
$sql = "DELETE FROM news_images WHERE id = $imageId AND news_id = $newsId";
if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Image deleted successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>
