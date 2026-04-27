<?php
// DELETE /admin/donations/{id}
$donationId = isset($_GET['id']) ? intval($_GET['id']) : null;

if (!$donationId) {
    sendResponse(['error' => 'Donation ID is required'], 400);
    exit;
}

$result = $conn->query("DELETE FROM donations WHERE donation_id = $donationId");
if ($result) {
    sendResponse(['message' => 'Donation deleted successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>
