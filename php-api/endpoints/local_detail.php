<?php
// GET /api/locals/:id
$conn = getDatabaseConnection();
$id = $conn->real_escape_string($_GET['id']);

$result = $conn->query("SELECT local_id AS id, name, established, facebook_url AS facebookUrl, instagramUrl, twitterUrl, hero_image_url AS heroImageUrl, logo_image_url AS logoImageUrl, corporate, non_corporate AS nonCorporate, youth, others, total_members_as_of AS totalMembersAsOf FROM `local` WHERE local_id = '$id'");
if (!$result) {
    sendResponse(['error' => $conn->error], 500);
}

if ($result->num_rows === 0) {
    sendResponse(['error' => 'Local not found'], 404);
}

$local = $result->fetch_assoc();

// Get pillars with programs and bullets
$pillarsQuery = "SELECT p.pillars_id AS pillarId, p.local_id AS localId, p.pillar_key AS `key`, p.label, p.color,
                        pp.program_id AS programId, pp.title AS programTitle,
                        b.bullet_text AS bulletText
                 FROM local_pillars p
                 LEFT JOIN local_programs pp ON p.pillars_id = pp.pillar_id
                 LEFT JOIN local_program_bullets b ON pp.program_id = b.program_id
                 WHERE p.local_id = '$id'
                 ORDER BY p.pillars_id, pp.program_id, b.bullet_id";

$pillarsResult = $conn->query($pillarsQuery);
if ($pillarsResult) {
    $pillarMap = [];
    while ($row = $pillarsResult->fetch_assoc()) {
        $pillarId = $row['pillarId'];
        if (!isset($pillarMap[$pillarId])) {
            $pillarMap[$pillarId] = [
                'id' => $pillarId,
                'localId' => $row['localId'],
                'key' => $row['key'],
                'label' => $row['label'],
                'color' => $row['color'],
                'programs' => []
            ];
        }

        if ($row['programId']) {
            if (!isset($pillarMap[$pillarId]['programs'][$row['programId']])) {
                $pillarMap[$pillarId]['programs'][$row['programId']] = [
                    'id' => $row['programId'],
                    'title' => $row['programTitle'],
                    'bullets' => [],
                    'sequenceOrder' => count($pillarMap[$pillarId]['programs'])
                ];
            }

            if ($row['bulletText']) {
                $pillarMap[$pillarId]['programs'][$row['programId']]['bullets'][] = $row['bulletText'];
            }
        }
    }

    foreach ($pillarMap as &$pillar) {
        if (!empty($pillar['programs'])) {
            $pillar['programs'] = array_values($pillar['programs']);
        }
    }

    $local['pillars'] = array_values($pillarMap);
}

sendResponse($local);
?>