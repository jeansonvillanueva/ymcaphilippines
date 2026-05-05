<?php
// Admin endpoint for managing documents - GET/POST
// GET: Fetch all documents
// POST: Create new document with file upload

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch all documents
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
                'display_order' => (int)$row['display_order'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
            ];
        }
        sendResponse($documents);
    } else {
        sendResponse(['error' => $conn->error], 500);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create new document
    $title = $conn->real_escape_string($_POST['title'] ?? '');
    $description = $conn->real_escape_string($_POST['description'] ?? '');
    $display_order = (int)($_POST['display_order'] ?? 0);

    if (empty($title)) {
        sendResponse(['error' => 'Title is required'], 400);
    }

    // Handle file upload
    if (!isset($_FILES['file'])) {
        sendResponse(['error' => 'No file provided'], 400);
    }

    $file = $_FILES['file'];
    $file_name = $file['name'];
    $file_type = $file['type'];
    $file_size = $file['size'];
    $file_tmp = $file['tmp_name'];

    // Validate file
    if ($file['error'] !== UPLOAD_ERR_OK) {
        sendResponse(['error' => 'File upload failed'], 400);
    }

    // Allowed MIME types for PDFs and documents
    $allowed_types = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
    ];

    if (!in_array($file_type, $allowed_types)) {
        sendResponse(['error' => 'Only PDF, DOC, DOCX, XLS, XLSX, and TXT files are allowed'], 400);
    }

    // Max file size: 10MB
    if ($file_size > 10 * 1024 * 1024) {
        sendResponse(['error' => 'File size must be less than 10MB'], 400);
    }

    // Create uploads directory if it doesn't exist
    $upload_dir = __DIR__ . '/../uploads/documents/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    // Generate unique filename to prevent conflicts
    $unique_filename = time() . '_' . basename($file_name);
    $file_path = $upload_dir . $unique_filename;

    if (!move_uploaded_file($file_tmp, $file_path)) {
        sendResponse(['error' => 'Failed to save file'], 500);
    }

    // Store in database
    $file_url = '/php-api/uploads/documents/' . $unique_filename;
    $stmt = $conn->prepare(
        "INSERT INTO documents (title, description, file_url, file_name, file_type, file_size, display_order) 
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param('sssssii', $title, $description, $file_url, $file_name, $file_type, $file_size, $display_order);

    if ($stmt->execute()) {
        sendResponse(['message' => 'Document uploaded successfully', 'id' => $stmt->insert_id]);
    } else {
        // Delete file if database insert fails
        unlink($file_path);
        sendResponse(['error' => 'Failed to save document to database'], 500);
    }
} else {
    sendResponse(['error' => 'Method not allowed'], 405);
}
?>
