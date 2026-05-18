<?php
// PUT /admin/locals/:id
$conn = getDatabaseConnection();
if (!$conn) {
    sendResponse(['error' => 'Database connection failed'], 500);
}

$data = getPostData();
$id = $conn->real_escape_string($_GET['id']);

// COMPREHENSIVE DIAGNOSTIC LOGGING
error_log("═════════════════════════════════════════════════════════");
error_log("[ADMIN_LOCALS_UPDATE] ===== START UPDATE REQUEST =====");
error_log("[ADMIN_LOCALS_UPDATE] Request time: " . date('Y-m-d H:i:s'));
error_log("[ADMIN_LOCALS_UPDATE] Local ID: " . $id);
error_log("[ADMIN_LOCALS_UPDATE] REQUEST_METHOD: " . ($_SERVER['REQUEST_METHOD'] ?? 'UNKNOWN'));
error_log("[ADMIN_LOCALS_UPDATE] CONTENT_TYPE: " . ($_SERVER['CONTENT_TYPE'] ?? 'UNKNOWN'));
error_log("[ADMIN_LOCALS_UPDATE] Raw POST data keys: " . implode(', ', array_keys($_POST)));
error_log("[ADMIN_LOCALS_UPDATE] Raw FILES count: " . count($_FILES));
error_log("[ADMIN_LOCALS_UPDATE] POST data: " . json_encode($data, JSON_UNESCAPED_SLASHES));

// Check if data is empty
if (empty($data)) {
    error_log("[ADMIN_LOCALS_UPDATE] **ERROR**: No data received from frontend!");
    sendResponse(['error' => 'No data received from frontend'], 400);
}

// Test database connection status
if ($conn->connect_error) {
    error_log("[ADMIN_LOCALS_UPDATE] **CONNECTION ERROR**: " . $conn->connect_error);
    sendResponse(['error' => 'Database connection failed: ' . $conn->connect_error], 500);
    exit;
}
error_log("[ADMIN_LOCALS_UPDATE] Database connection: OK");
error_log("[ADMIN_LOCALS_UPDATE] Selected DB: " . $conn->get_charset()->charset);

$name = $conn->real_escape_string($data['name']);
$established = isset($data['established']) ? $conn->real_escape_string($data['established']) : '';
$facebookUrl = isset($data['facebookUrl']) ? $conn->real_escape_string($data['facebookUrl']) : '';
$instagramUrl = isset($data['instagramUrl']) ? $conn->real_escape_string($data['instagramUrl']) : '';
$twitterUrl = isset($data['twitterUrl']) ? $conn->real_escape_string($data['twitterUrl']) : '';
$heroImageUrl = isset($data['heroImageUrl']) ? $conn->real_escape_string($data['heroImageUrl']) : '';
$logoImageUrl = isset($data['logoImageUrl']) ? $conn->real_escape_string($data['logoImageUrl']) : '';
$corporate = isset($data['corporate']) ? intval($data['corporate']) : 0;
$nonCorporate = isset($data['nonCorporate']) ? intval($data['nonCorporate']) : 0;
$youth = isset($data['youth']) ? intval($data['youth']) : 0;
$others = isset($data['others']) ? intval($data['others']) : 0;
$totalMembersAsOf = isset($data['totalMembersAsOf']) ? $conn->real_escape_string($data['totalMembersAsOf']) : '';

// For YEAR columns, use NULL if empty; otherwise wrap in quotes
$establishedClause = $established === '' ? 'NULL' : "'$established'";
$totalMembersAsOfClause = $totalMembersAsOf === '' ? 'NULL' : "'$totalMembersAsOf'";

error_log("[ADMIN_LOCALS_UPDATE] Parsed values:");
error_log("  - Name: '$name'");
error_log("  - Corporate: $corporate");
error_log("  - Non-Corporate: $nonCorporate");
error_log("  - Youth: $youth");
error_log("  - Others: $others");
error_log("  - Facebook: '$facebookUrl'");
error_log("  - Instagram: '$instagramUrl'");

// Verify the local exists first
error_log("[ADMIN_LOCALS_UPDATE] Checking if local exists with local_id='$id'");
$existsResult = $conn->query("SELECT local_id, name as existing_name FROM `local` WHERE local_id = '$id'");
if (!$existsResult) {
    error_log("[ADMIN_LOCALS_UPDATE] **EXISTENCE CHECK QUERY ERROR**: " . $conn->error);
    sendResponse(['error' => 'Database error: ' . $conn->error], 500);
    exit;
}

if ($existsResult->num_rows === 0) {
    error_log("[ADMIN_LOCALS_UPDATE] **NOT FOUND**: No local record with local_id='$id'");
    sendResponse(['error' => 'Local with ID "' . $id . '" not found in database'], 404);
    exit;
}

$existingRow = $existsResult->fetch_assoc();
error_log("[ADMIN_LOCALS_UPDATE] Found existing local: " . json_encode($existingRow));

// Build and execute update query
$sql = "UPDATE `local` SET name='$name', established=$establishedClause, facebook_url='$facebookUrl', instagramUrl='$instagramUrl', twitterUrl='$twitterUrl', hero_image_url='$heroImageUrl', logo_image_url='$logoImageUrl', corporate=$corporate, non_corporate=$nonCorporate, youth=$youth, others=$others, total_members_as_of=$totalMembersAsOfClause WHERE local_id='$id'";

error_log("[ADMIN_LOCALS_UPDATE] Executing SQL: " . $sql);

if ($conn->query($sql) === TRUE) {
    $affectedRows = $conn->affected_rows;
    error_log("[ADMIN_LOCALS_UPDATE] **UPDATE SUCCESSFUL** - Affected rows: $affectedRows");
    
    // Verify update was successful
    $verifyResult = $conn->query("SELECT name FROM `local` WHERE local_id='$id' LIMIT 1");
    if ($verifyResult && $verifyResult->num_rows > 0) {
        $verifyRow = $verifyResult->fetch_assoc();
        error_log("[ADMIN_LOCALS_UPDATE] Verification - New name in DB: " . $verifyRow['name']);
    }
    
    if ($affectedRows === 0) {
        error_log("[ADMIN_LOCALS_UPDATE] **WARNING**: Update query succeeded but no rows were changed");
        error_log("[ADMIN_LOCALS_UPDATE] This means either:");
        error_log("  1. Data values haven't changed (update values same as existing)");
        error_log("  2. Local ID exists but WHERE clause didn't match");
        sendResponse(['message' => 'Local updated successfully', 'warning' => 'No rows were changed (data may be identical to existing)'], 200);
    } else {
        sendResponse(['message' => 'Local updated successfully', 'affectedRows' => $affectedRows]);
    }
} else {
    error_log("[ADMIN_LOCALS_UPDATE] **UPDATE FAILED**: " . $conn->error);
    error_log("[ADMIN_LOCALS_UPDATE] SQL: " . $sql);
    sendResponse(['error' => 'Database update failed: ' . $conn->error], 500);
}
error_log("[ADMIN_LOCALS_UPDATE] ===== END UPDATE REQUEST =====");
error_log("═════════════════════════════════════════════════════════");
?>
