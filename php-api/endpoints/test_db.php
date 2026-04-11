<?php
// GET /test-db
$result = $conn->query("SELECT 1");
if ($result) {
    sendResponse(['message' => 'Database is working!']);
} else {
    sendResponse(['error' => 'Database error'], 500);
}
?>