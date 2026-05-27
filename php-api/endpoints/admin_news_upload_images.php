<?php
// POST /admin/news/:newsId/upload
error_log('[admin_news_upload_images.php] Starting image upload');
error_log('[admin_news_upload_images.php] $_GET: ' . json_encode($_GET));
error_log('[admin_news_upload_images.php] REQUEST_METHOD: ' . $_SERVER['REQUEST_METHOD']);

$newsId = $conn->real_escape_string($_GET['newsId']);
error_log('[admin_news_upload_images.php] Extracted newsId: ' . $newsId);

// Check if news exists
$newsResult = $conn->query("SELECT id FROM news WHERE id = $newsId");
if (!$newsResult || $newsResult->num_rows === 0) {
    error_log('[admin_news_upload_images.php] News not found for ID: ' . $newsId);
    sendResponse(['error' => 'News article not found'], 404);
    exit;
}
error_log('[admin_news_upload_images.php] News found, proceeding with image upload');

// Check if up to 20 images are already uploaded (supports multiple slideshow blocks)
$imageCountResult = $conn->query("SELECT COUNT(*) as count FROM news_images WHERE news_id = $newsId");
if ($imageCountResult) {
    $row = $imageCountResult->fetch_assoc();
    if ($row['count'] >= 20) {
        sendResponse(['error' => 'Maximum 20 images allowed per news article'], 400);
        exit;
    }
}

$imagePath = handleFileUpload('image');
if (!$imagePath) {
    sendResponse(['error' => 'No file uploaded.'], 400);
    exit;
}

// Get the next image order
$orderResult = $conn->query("SELECT MAX(image_order) as max_order FROM news_images WHERE news_id = $newsId");
$nextOrder = 0;
if ($orderResult) {
    $row = $orderResult->fetch_assoc();
    $nextOrder = ($row['max_order'] !== null) ? $row['max_order'] + 1 : 0;
}

// Insert the image record
$imagePath = $conn->real_escape_string($imagePath);
$sql = "INSERT INTO news_images (news_id, image_url, image_order) VALUES ($newsId, '$imagePath', $nextOrder)";

if ($conn->query($sql) === TRUE) {
    $imageId = $conn->insert_id;
    sendResponse([
        'message' => 'Image uploaded successfully',
        'id' => $imageId,
        'image_url' => $imagePath,
        'image_order' => $nextOrder
    ]);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>
