<?php
// GET /admin/locals/:id
$id = $conn->real_escape_string($_GET['id']);

$result = $conn->query("SELECT * FROM locals WHERE id = '$id'");
if (!$result) {
    sendResponse(['error' => $conn->error], 500);
}

if ($result->num_rows === 0) {
    sendResponse(['error' => 'Local not found'], 404);
}

$local = $result->fetch_assoc();

// Get pillars with programs
$pillarsQuery = "SELECT p.id, p.localId, p.`key` AS `key`, p.label, p.color,
                        pp.id AS programId, pp.title AS programTitle, pp.bullets AS programBullets, pp.sequenceOrder
                 FROM pillars p
                 LEFT JOIN pillar_programs pp ON p.id = pp.pillarId
                 WHERE p.localId = '$id'
                 ORDER BY p.id, pp.sequenceOrder";

$pillarsResult = $conn->query($pillarsQuery);
if ($pillarsResult) {
    $pillarMap = [];
    while ($row = $pillarsResult->fetch_assoc()) {
        $pillarId = $row['id'];
        if (!isset($pillarMap[$pillarId])) {
            $pillarMap[$pillarId] = [
                'id' => $row['id'],
                'localId' => $row['localId'],
                'key' => $row['key'],
                'label' => $row['label'],
                'color' => $row['color'],
                'programs' => []
            ];
        }

        if ($row['programId']) {
            $bullets = [];
            if ($row['programBullets']) {
                $bullets = json_decode($row['programBullets'], true);
                if (!is_array($bullets)) {
                    $bullets = [];
                }
            }

            $pillarMap[$pillarId]['programs'][] = [
                'id' => $row['programId'],
                'title' => $row['programTitle'],
                'bullets' => $bullets,
                'sequenceOrder' => $row['sequenceOrder']
            ];
        }
    }

    $local['pillars'] = array_values($pillarMap);
}

sendResponse($local);
?>