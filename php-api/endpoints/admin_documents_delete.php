<?php
// DELETE /admin/documents/:id - Delete document and associated file
$id = intval($_GET['id'] ?? 0);

if ($id <= 0) {
    sendResponse(['error' => 'Invalid document ID'], 400);
}

// Get document to retrieve file path
$result = $conn->query("SELECT file_url FROM documents WHERE id = $id");
if (!$result || $result->num_rows === 0) {
    sendResponse(['error' => 'Document not found'], 404);
}

$row = $result->fetch_assoc();
$file_url = $row['file_url'];

// Delete from database
$stmt = $conn->prepare("DELETE FROM documents WHERE id = ?");
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    // Try to delete the file
    $file_path = __DIR__ . '/../' . str_replace('/php-api/', '', $file_url);
    if (file_exists($file_path)) {
        unlink($file_path);
    }
    sendResponse(['message' => 'Document deleted successfully']);
} else {
    sendResponse(['error' => 'Failed to delete document'], 500);
}
?>
