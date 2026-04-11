<?php
// GET /admin/donations
$result = $conn->query("SELECT * FROM donations ORDER BY created_at DESC");
if ($result) {
    $donations = [];
    while ($row = $result->fetch_assoc()) {
        $donations[] = $row;
    }
    sendResponse($donations);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>