<?php
// PUT/POST /admin/locals/:id/pillar-programs
require_once __DIR__ . '/../pillars_helper.php';

if (!$conn) {
    sendResponse(['error' => 'Database connection failed'], 500);
}

$localId = isset($_GET['id']) ? trim((string)$_GET['id']) : '';
if ($localId === '') {
    sendResponse(['error' => 'Local id is required'], 400);
}

$data = getPostData();
if (!is_array($data)) {
    sendResponse(['error' => 'Could not read request body. Use Save programs again.'], 400);
}

$pillars = $data['pillars'] ?? null;
$localName = isset($data['name']) ? trim((string)$data['name']) : null;

if (!is_array($pillars)) {
    sendResponse([
        'error' => 'No program data received by the server. Upload the latest php-api files.',
        'debug' => [
            'contentType' => $_SERVER['CONTENT_TYPE'] ?? '',
            'method' => $_SERVER['REQUEST_METHOD'] ?? '',
            'bodyKeys' => array_keys($data),
        ],
    ], 400);
}

$result = saveLocalPillarPrograms($conn, $localId, $pillars, $localName);
if (isset($result['error'])) {
    sendResponse(array_merge($result, [
        'localId' => $localId,
        'tablesReady' => ensureLocalPillarTables($conn),
        'pillars' => [],
    ]), 400);
}

$savedPillars = $result['pillars'] ?? fetchLocalPillarsWithPrograms($conn, $localId);

sendResponse([
    'message' => 'Pillar programs saved successfully',
    'localId' => $localId,
    'tablesReady' => true,
    'pillars' => $savedPillars,
    'sentBulletCount' => $result['sentBulletCount'] ?? 0,
    'savedBulletCount' => $result['savedBulletCount'] ?? countBulletsInPillarList($savedPillars),
]);
?>
