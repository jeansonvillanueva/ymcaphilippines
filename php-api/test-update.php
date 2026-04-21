<?php
require_once 'config.php';

header('Content-Type: application/json');

$conn = getDatabaseConnection();
if (!$conn) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing local ID parameter. Usage: test-update.php?id=MANILA']);
    exit;
}

$id = $conn->real_escape_string($_GET['id']);
$testName = 'TEST_UPDATE_' . date('Y-m-d H:i:s');

error_log("═══════════════════════════════════════════");
error_log("[TEST-UPDATE] Testing update for local_id='$id'");
error_log("[TEST-UPDATE] New test name: '$testName'");

// Check if local exists
$checkResult = $conn->query("SELECT name as original_name FROM `local` WHERE local_id='$id' LIMIT 1");
if (!$checkResult) {
    error_log("[TEST-UPDATE] **ERROR**: " . $conn->error);
    http_response_code(500);
    echo json_encode([
        'error' => 'Query error: ' . $conn->error,
        'sql' => "SELECT name FROM `local` WHERE local_id='$id'"
    ]);
    exit;
}

if ($checkResult->num_rows === 0) {
    error_log("[TEST-UPDATE] Local not found with ID='$id'");
    http_response_code(404);
    echo json_encode(['error' => "Local with ID '$id' not found in database"]);
    exit;
}

$original = $checkResult->fetch_assoc();
error_log("[TEST-UPDATE] Found original name: " . $original['original_name']);

// Perform test update
$updateSql = "UPDATE `local` SET name='$testName' WHERE local_id='$id'";
error_log("[TEST-UPDATE] Executing: $updateSql");

$updateSuccess = $conn->query($updateSql);
$affectedRows = $conn->affected_rows;

error_log("[TEST-UPDATE] Update result: " . ($updateSuccess ? 'TRUE' : 'FALSE'));
error_log("[TEST-UPDATE] Affected rows: $affectedRows");

if (!$updateSuccess) {
    error_log("[TEST-UPDATE] **UPDATE FAILED**: " . $conn->error);
    http_response_code(500);
    echo json_encode([
        'error' => 'Update failed: ' . $conn->error,
        'sql' => $updateSql
    ]);
    exit;
}

// Verify update
$verifyResult = $conn->query("SELECT name as new_name FROM `local` WHERE local_id='$id' LIMIT 1");
$verified = false;
$verifyName = null;

if ($verifyResult && $verifyResult->num_rows > 0) {
    $verifyRow = $verifyResult->fetch_assoc();
    $verifyName = $verifyRow['new_name'];
    $verified = ($verifyName === $testName);
    error_log("[TEST-UPDATE] Verified new name: " . $verifyName);
    error_log("[TEST-UPDATE] Verification: " . ($verified ? 'SUCCESS' : 'MISMATCH'));
}

$response = [
    'success' => $updateSuccess && $affectedRows > 0 && $verified,
    'details' => [
        'local_id' => $id,
        'original_name' => $original['original_name'],
        'test_name' => $testName,
        'update_query_success' => $updateSuccess,
        'affected_rows' => $affectedRows,
        'verified_new_name' => $verifyName,
        'verification_passed' => $verified,
    ],
    'diagnostics' => [
        'update_found_records' => $affectedRows > 0,
        'data_actually_changed' => $verified,
    ],
];

if (!$response['success']) {
    http_response_code(500);
    if ($affectedRows === 0) {
        $response['error'] = 'Update executed but affected 0 rows - local may not exist or data is identical';
    } elseif (!$verified) {
        $response['error'] = 'Update succeeded but verification failed - data may not have been saved correctly';
    }
}

error_log("[TEST-UPDATE] Response: " . json_encode($response));
error_log("═══════════════════════════════════════════");

echo json_encode($response, JSON_PRETTY_PRINT);
?>
