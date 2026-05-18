<?php
// GET /api/facilities/:localId
// Updated for new facilities_list table format
// Returns facilities for display on user-facing pages

$localId = $conn->real_escape_string($_GET['localId']);

// Get facilities from the new table
$result = $conn->query("SELECT id, facility_name, facility_details FROM facilities_list WHERE local_id = '$localId' ORDER BY sequence_order ASC");

if (!$result) {
    sendResponse(['error' => $conn->error], 500);
    exit;
}

$allFacilities = [];
while ($row = $result->fetch_assoc()) {
    // Only include facilities with a name (should all have names)
    if (!empty($row['facility_name'])) {
        $allFacilities[] = [
            'name' => $row['facility_name'],
            'details' => $row['facility_details'],
            'isEnabled' => true
        ];
    }
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
    'allFacilities' => $allFacilities,
    'images' => $images
]);
?>
