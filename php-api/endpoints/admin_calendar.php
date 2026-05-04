<?php
// GET /admin/calendar
$result = $conn->query("SELECT * FROM calendar_events ORDER BY start_date DESC");
if ($result) {
    $events = [];
    while ($row = $result->fetch_assoc()) {
        // Transform snake_case column names to camelCase for frontend compatibility
        $event = [
            'id' => $row['id'],
            'title' => $row['title'],
            'date' => $row['date'],
            'startDate' => $row['start_date'],  // snake_case -> camelCase
            'endDate' => $row['end_date'],      // snake_case -> camelCase
            'description' => $row['description'],
            'imageUrl' => $row['imageUrl'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at'],
        ];
        $events[] = $event;
    }
    sendResponse($events);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>