<?php
// GET /api/locals
$conn = getDatabaseConnection();
$result = $conn->query("SELECT local_id AS id, name, established, facebook_url AS facebookUrl, instagramUrl, twitterUrl, hero_image_url AS heroImageUrl, logo_image_url AS logoImageUrl, corporate, non_corporate AS nonCorporate, youth, others, total_members_as_of AS totalMembersAsOf FROM `local` ORDER BY name");
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