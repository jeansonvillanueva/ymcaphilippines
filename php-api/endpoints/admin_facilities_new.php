<?php
// GET /admin/facilities/:localId
// Updated for new facilities_list table format
$localId = $conn->real_escape_string($_GET['localId']);

// Get facilities from the new table
$result = $conn->query("SELECT id, local_id, facility_name, facility_details, sequence_order FROM facilities_list WHERE local_id = '$localId' ORDER BY sequence_order ASC");

if (!$result) {
    sendResponse(['error' => $conn->error], 500);
    exit;
}

$facilities = [];
while ($row = $result->fetch_assoc()) {
    $facilities[] = [
        'id' => (int)$row['id'],
        'name' => $row['facility_name'],
        'details' => $row['facility_details'],
        'sequenceOrder' => (int)$row['sequence_order']
    ];
}

// Get associated images
$imagesResult = $conn->query("SELECT id, local_id, image_url, image_order FROM facilities_images WHERE local_id = '$localId' ORDER BY image_order ASC");
$images = [];
if ($imagesResult) {
    while ($row = $imagesResult->fetch_assoc()) {
        $images[] = $row;
    }
}

sendResponse([
    'facilities' => $facilities,
    'images' => $images
]);
?>
