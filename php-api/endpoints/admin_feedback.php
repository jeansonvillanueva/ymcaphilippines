<?php
// GET /admin/feedback
$conn = getDatabaseConnection();
if (!$conn) {
    sendResponse(['error' => 'Database connection failed'], 500);
}

$result = $conn->query("SELECT * FROM feedback ORDER BY created_at DESC");
if ($result) {
    $feedback = [];
    while ($row = $result->fetch_assoc()) {
        $feedback[] = $row;
    }
    sendResponse($feedback);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>