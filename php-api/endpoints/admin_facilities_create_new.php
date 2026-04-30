<?php
// POST /admin/facilities/:localId
// Updated for new facilities_list table format
$localId = $conn->real_escape_string($_GET['localId']);

// Get JSON data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['facilities']) || !is_array($data['facilities'])) {
    sendResponse(['error' => 'Invalid request: facilities array required'], 400);
    exit;
}

$facilitiesToSave = $data['facilities'];

try {
    // Start transaction
    $conn->begin_transaction();

    // Delete existing facilities for this local
    $deleteResult = $conn->query("DELETE FROM facilities_list WHERE local_id = '$localId'");
    if (!$deleteResult) {
        throw new Exception("Error deleting existing facilities: " . $conn->error);
    }

    // Insert new facilities
    foreach ($facilitiesToSave as $index => $facility) {
        $facilityName = $conn->real_escape_string($facility['name'] ?? '');
        $facilityDetails = $conn->real_escape_string($facility['details'] ?? '');
        $sequenceOrder = (int)$index;

        // Skip empty facility names
        if (empty($facilityName)) {
            continue;
        }

        $insertSql = "INSERT INTO facilities_list 
                      (local_id, facility_name, facility_details, sequence_order) 
                      VALUES ('$localId', '$facilityName', '$facilityDetails', $sequenceOrder)";

        if (!$conn->query($insertSql)) {
            throw new Exception("Error inserting facility: " . $conn->error);
        }
    }

    // Commit transaction
    $conn->commit();

    // Fetch and return updated facilities
    $result = $conn->query("SELECT id, local_id, facility_name, facility_details, sequence_order FROM facilities_list WHERE local_id = '$localId' ORDER BY sequence_order ASC");

    $facilities = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $facilities[] = [
                'id' => (int)$row['id'],
                'name' => $row['facility_name'],
                'details' => $row['facility_details'],
                'sequenceOrder' => (int)$row['sequence_order']
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
        'message' => 'Facilities saved successfully',
        'facilities' => $facilities,
        'images' => $images
    ]);

} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    sendResponse(['error' => $e->getMessage()], 500);
}
?>
