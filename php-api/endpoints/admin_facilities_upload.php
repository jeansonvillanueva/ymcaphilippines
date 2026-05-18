<?php
// POST /admin/facilities/:localId/upload
$localId = $conn->real_escape_string($_GET['localId']);

// Check if up to 5 images are already uploaded
$imageCountResult = $conn->query("SELECT COUNT(*) as count FROM facilities_images WHERE local_id = '$localId'");
if ($imageCountResult) {
    $row = $imageCountResult->fetch_assoc();
    if ($row['count'] >= 5) {
        sendResponse(['error' => 'Maximum 5 images allowed per facility'], 400);
        exit;
    }
}

$imagePath = handleFileUpload('image');
if (!$imagePath) {
    sendResponse(['error' => 'No file uploaded.'], 400);
    exit;
}

// Get the next image order
$orderResult = $conn->query("SELECT MAX(image_order) as max_order FROM facilities_images WHERE local_id = '$localId'");
$nextOrder = 0;
if ($orderResult) {
    $row = $orderResult->fetch_assoc();
    $nextOrder = ($row['max_order'] !== null) ? $row['max_order'] + 1 : 0;
}

// Insert the image record
$imagePath = $conn->real_escape_string($imagePath);
$sql = "INSERT INTO facilities_images (local_id, image_url, image_order) VALUES ('$localId', '$imagePath', $nextOrder)";

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
