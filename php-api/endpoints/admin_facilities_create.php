<?php
// POST /admin/facilities/:localId
$localId = $conn->real_escape_string($_GET['localId']);

// Get JSON data
$data = json_decode(file_get_contents('php://input'), true);

// Escape facility data
$buildings = $conn->real_escape_string($data['buildings'] ?? '');
$buildingsEnabled = isset($data['buildings_enabled']) && $data['buildings_enabled'] ? 1 : 0;

$roomAccommodations = $conn->real_escape_string($data['room_accommodations'] ?? '');
$roomAccommodationsEnabled = isset($data['room_accommodations_enabled']) && $data['room_accommodations_enabled'] ? 1 : 0;

$basketballCourt = $conn->real_escape_string($data['basketball_court'] ?? '');
$basketballCourtEnabled = isset($data['basketball_court_enabled']) && $data['basketball_court_enabled'] ? 1 : 0;

$swimmingPool = $conn->real_escape_string($data['swimming_pool'] ?? '');
$swimmingPoolEnabled = isset($data['swimming_pool_enabled']) && $data['swimming_pool_enabled'] ? 1 : 0;

$fitnessGym = $conn->real_escape_string($data['fitness_gym'] ?? '');
$fitnessGymEnabled = isset($data['fitness_gym_enabled']) && $data['fitness_gym_enabled'] ? 1 : 0;

$functionHall = $conn->real_escape_string($data['function_hall'] ?? '');
$functionHallEnabled = isset($data['function_hall_enabled']) && $data['function_hall_enabled'] ? 1 : 0;

$badmintonCourt = $conn->real_escape_string($data['badminton_court'] ?? '');
$badmintonCourtEnabled = isset($data['badminton_court_enabled']) && $data['badminton_court_enabled'] ? 1 : 0;

$tennisCourt = $conn->real_escape_string($data['tennis_court'] ?? '');
$tennisCourtEnabled = isset($data['tennis_court_enabled']) && $data['tennis_court_enabled'] ? 1 : 0;

$martialArts = $conn->real_escape_string($data['martial_arts'] ?? '');
$martialArtsEnabled = isset($data['martial_arts_enabled']) && $data['martial_arts_enabled'] ? 1 : 0;

$spaces = $conn->real_escape_string($data['spaces'] ?? '');
$spacesEnabled = isset($data['spaces_enabled']) && $data['spaces_enabled'] ? 1 : 0;

$otherFacilities = $conn->real_escape_string($data['other_facilities'] ?? '');
$otherFacilitiesEnabled = isset($data['other_facilities_enabled']) && $data['other_facilities_enabled'] ? 1 : 0;

// Check if facilities record exists
$checkResult = $conn->query("SELECT id FROM facilities WHERE local_id = '$localId'");
if (!$checkResult) {
    sendResponse(['error' => $conn->error], 500);
    exit;
}

if ($checkResult->num_rows > 0) {
    // Update existing record
    $sql = "UPDATE facilities SET 
        buildings = '$buildings',
        buildings_enabled = $buildingsEnabled,
        room_accommodations = '$roomAccommodations',
        room_accommodations_enabled = $roomAccommodationsEnabled,
        basketball_court = '$basketballCourt',
        basketball_court_enabled = $basketballCourtEnabled,
        swimming_pool = '$swimmingPool',
        swimming_pool_enabled = $swimmingPoolEnabled,
        fitness_gym = '$fitnessGym',
        fitness_gym_enabled = $fitnessGymEnabled,
        function_hall = '$functionHall',
        function_hall_enabled = $functionHallEnabled,
        badminton_court = '$badmintonCourt',
        badminton_court_enabled = $badmintonCourtEnabled,
        tennis_court = '$tennisCourt',
        tennis_court_enabled = $tennisCourtEnabled,
        martial_arts = '$martialArts',
        martial_arts_enabled = $martialArtsEnabled,
        spaces = '$spaces',
        spaces_enabled = $spacesEnabled,
        other_facilities = '$otherFacilities',
        other_facilities_enabled = $otherFacilitiesEnabled,
        updated_at = CURRENT_TIMESTAMP
        WHERE local_id = '$localId'";
} else {
    // Insert new record
    $sql = "INSERT INTO facilities 
        (local_id, buildings, buildings_enabled, room_accommodations, room_accommodations_enabled, basketball_court, basketball_court_enabled, swimming_pool, swimming_pool_enabled, fitness_gym, fitness_gym_enabled, function_hall, function_hall_enabled, badminton_court, badminton_court_enabled, tennis_court, tennis_court_enabled, martial_arts, martial_arts_enabled, spaces, spaces_enabled, other_facilities, other_facilities_enabled) 
        VALUES 
        ('$localId', '$buildings', $buildingsEnabled, '$roomAccommodations', $roomAccommodationsEnabled, '$basketballCourt', $basketballCourtEnabled, '$swimmingPool', $swimmingPoolEnabled, '$fitnessGym', $fitnessGymEnabled, '$functionHall', $functionHallEnabled, '$badmintonCourt', $badmintonCourtEnabled, '$tennisCourt', $tennisCourtEnabled, '$martialArts', $martialArtsEnabled, '$spaces', $spacesEnabled, '$otherFacilities', $otherFacilitiesEnabled)";
}

if ($conn->query($sql) === TRUE) {
    // Fetch and return updated facilities
    $result = $conn->query("SELECT id, local_id, buildings, buildings_enabled, room_accommodations, room_accommodations_enabled, basketball_court, basketball_court_enabled, swimming_pool, swimming_pool_enabled, fitness_gym, fitness_gym_enabled, function_hall, function_hall_enabled, badminton_court, badminton_court_enabled, tennis_court, tennis_court_enabled, martial_arts, martial_arts_enabled, spaces, spaces_enabled, other_facilities, other_facilities_enabled FROM facilities WHERE local_id = '$localId'");
    
    if ($result && $result->num_rows > 0) {
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
            'message' => 'Facilities saved successfully',
            'facilities' => $facilities,
            'images' => $images
        ]);
    } else {
        sendResponse(['error' => 'Failed to retrieve saved facilities'], 500);
    }
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>

