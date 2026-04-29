<?php
// GET /api/calendar - Public calendar endpoint (no auth required)
$result = $conn->query("SELECT * FROM calendar_events ORDER BY date DESC");
if ($result) {
    $events = [];
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    sendResponse($events);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>
