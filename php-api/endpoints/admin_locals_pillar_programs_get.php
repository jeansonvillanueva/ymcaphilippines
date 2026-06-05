<?php
// GET /admin/locals/:id/pillar-programs
require_once __DIR__ . '/../pillars_helper.php';

if (!$conn) {
    sendResponse(['error' => 'Database connection failed'], 500);
}

$localId = isset($_GET['id']) ? trim((string)$_GET['id']) : '';
if ($localId === '') {
    sendResponse(['error' => 'Local id is required'], 400);
}

$tablesOk = ensureLocalPillarTables($conn);
$escapedId = $conn->real_escape_string($localId);
$localCheck = $conn->query("SELECT local_id, name FROM `local` WHERE local_id = '$escapedId' LIMIT 1");

$pillars = fetchLocalPillarsWithPrograms($conn, $localId);

sendResponse([
    'localId' => $localId,
    'localExists' => $localCheck && $localCheck->num_rows > 0,
    'tablesReady' => $tablesOk,
    'pillars' => $pillars,
    'savedBulletCount' => countBulletsInPillarList($pillars),
]);
