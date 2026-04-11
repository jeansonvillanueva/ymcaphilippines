<?php
// GET /admin/staff
$result = $conn->query("SELECT * FROM staff ORDER BY departmentGroup, sequenceOrder");
if ($result) {
    $staff = [];
    while ($row = $result->fetch_assoc()) {
        $staff[] = $row;
    }
    sendResponse($staff);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>