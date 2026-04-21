<?php
// GET /test-db
$conn = getDatabaseConnection();
if ($conn === null) {
    sendResponse(['error' => 'Database connection failed'], 500);
} else {
    $result = $conn->query("SELECT 1");
    if ($result) {
        sendResponse(['message' => 'Database is working!']);
    } else {
        sendResponse(['error' => 'Database error: ' . $conn->error], 500);
    }
}
?>