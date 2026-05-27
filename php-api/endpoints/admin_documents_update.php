<?php
// PUT /admin/documents/:id - Update document metadata
$data = getPostData();
$id = intval($_GET['id'] ?? $_POST['id'] ?? $data['id'] ?? 0);
if ($id <= 0) {
    $id = getNumericRouteId('documents');
}

if ($id <= 0) {
    sendResponse(['error' => 'Invalid document ID'], 400);
}

// Check if the document exists
$checkExists = $conn->query("SELECT id FROM documents WHERE id = $id");
if (!$checkExists || $checkExists->num_rows === 0) {
    sendResponse(['error' => 'Document not found'], 404);
}

if (!isset($data['title']) || empty(trim($data['title']))) {
    sendResponse(['error' => "Field 'title' is required"], 400);
}

$title = $conn->real_escape_string(trim($data['title']));
$description = isset($data['description']) ? $conn->real_escape_string($data['description']) : '';
$display_order = isset($data['display_order']) ? (int)$data['display_order'] : 0;

// Update document
$stmt = $conn->prepare(
    "UPDATE documents SET title = ?, description = ?, display_order = ? WHERE id = ?"
);
$stmt->bind_param('ssii', $title, $description, $display_order, $id);

if ($stmt->execute()) {
    sendResponse(['message' => 'Document updated successfully']);
} else {
    sendResponse(['error' => 'Failed to update document'], 500);
}
?>
