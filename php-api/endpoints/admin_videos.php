<?php
// GET /admin/videos
$result = $conn->query("SELECT * FROM videos ORDER BY id DESC");
if ($result) {
    $videos = [];
    while ($row = $result->fetch_assoc()) {
        $videos[] = $row;
    }
    sendResponse($videos);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>