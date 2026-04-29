<?php
// GET /admin/facilities/:localId
$localId = $conn->real_escape_string($_GET['localId']);

// Get facilities for the local
$result = $conn->query("SELECT id, local_id, buildings, buildings_enabled, room_accommodations, room_accommodations_enabled, basketball_court, basketball_court_enabled, swimming_pool, swimming_pool_enabled, fitness_gym, fitness_gym_enabled, function_hall, function_hall_enabled, badminton_court, badminton_court_enabled, tennis_court, tennis_court_enabled, martial_arts, martial_arts_enabled, spaces, spaces_enabled, other_facilities, other_facilities_enabled FROM facilities WHERE local_id = '$localId'");

if (!$result) {
    sendResponse(['error' => $conn->error], 500);
    exit;
}

if ($result->num_rows === 0) {
    // Return empty facilities object if not found
    sendResponse([
        'facilities' => [],
        'images' => []
    ]);
    exit;
}

$facilities = $result->fetch_assoc();

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

