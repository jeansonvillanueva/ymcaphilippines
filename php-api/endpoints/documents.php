<?php
// GET /api/documents - Public documents endpoint (no auth required)
// Fetch all documents ordered by display order

$result = $conn->query("SELECT * FROM documents ORDER BY display_order ASC, created_at DESC");

if ($result) {
    $documents = [];
    while ($row = $result->fetch_assoc()) {
        $documents[] = [
            'id' => (int)$row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'file_url' => $row['file_url'],
            'file_name' => $row['file_name'],
            'file_type' => $row['file_type'],
            'file_size' => (int)$row['file_size'],
            'created_at' => $row['created_at'],
        ];
    }
    sendResponse($documents);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>
