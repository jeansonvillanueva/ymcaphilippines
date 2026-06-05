<?php
// GET /admin/locals/:id
require_once __DIR__ . '/../pillars_helper.php';

$id = $conn->real_escape_string($_GET['id']);

$result = $conn->query("SELECT local_id AS id, name, established, facebook_url AS facebookUrl, instagramUrl, twitterUrl, hero_image_url AS heroImageUrl, logo_image_url AS logoImageUrl, embedded_map_url AS embeddedMapUrl, corporate, non_corporate AS nonCorporate, youth, others, total_members_as_of AS totalMembersAsOf FROM `local` WHERE local_id = '$id'");
if (!$result) {
    sendResponse(['error' => $conn->error], 500);
}

if ($result->num_rows === 0) {
    sendResponse(['error' => 'Local not found'], 404);
}

$local = $result->fetch_assoc();
$local['tablesReady'] = ensureLocalPillarTables($conn);

try {
    $local['pillars'] = fetchLocalPillarsWithPrograms($conn, $id);
} catch (Throwable $e) {
    error_log('[admin_locals_detail] Pillars fetch failed for ' . $id . ': ' . $e->getMessage());
    $local['pillars'] = [];
}

sendResponse($local);
?>
