<?php
// GET /api/users
$result = $conn->query("SELECT * FROM users");
if ($result) {
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    sendResponse($users);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>