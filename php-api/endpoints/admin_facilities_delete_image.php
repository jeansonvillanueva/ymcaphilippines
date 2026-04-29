<?php
// DELETE /admin/facilities/:localId/images/:imageId
$localId = $conn->real_escape_string($_GET['localId']);
$imageId = $conn->real_escape_string($_GET['imageId']);

// Check if image exists and belongs to this local
$result = $conn->query("SELECT image_url FROM facilities_images WHERE id = $imageId AND local_id = '$localId'");
if (!$result || $result->num_rows === 0) {
    sendResponse(['error' => 'Image not found'], 404);
    exit;
}

// Delete the database record
$sql = "DELETE FROM facilities_images WHERE id = $imageId AND local_id = '$localId'";
if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Image deleted successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>
