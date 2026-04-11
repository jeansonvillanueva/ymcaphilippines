<?php
// GET /api/locals
$result = $conn->query("SELECT * FROM locals ORDER BY name");
if ($result) {
    $locals = [];
    while ($row = $result->fetch_assoc()) {
        $locals[] = $row;
    }
    sendResponse($locals);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>