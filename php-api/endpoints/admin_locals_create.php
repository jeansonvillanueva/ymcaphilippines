<?php
// POST /admin/locals
$data = getPostData();

validateRequired($data, ['id', 'name']);

$id = $conn->real_escape_string($data['id']);
$name = $conn->real_escape_string($data['name']);
$established = isset($data['established']) ? $conn->real_escape_string($data['established']) : '';
$facebookUrl = isset($data['facebookUrl']) ? $conn->real_escape_string($data['facebookUrl']) : '';
$instagramUrl = isset($data['instagramUrl']) ? $conn->real_escape_string($data['instagramUrl']) : '';
$twitterUrl = isset($data['twitterUrl']) ? $conn->real_escape_string($data['twitterUrl']) : '';
$heroImageUrl = isset($data['heroImageUrl']) ? $conn->real_escape_string($data['heroImageUrl']) : '';
$logoImageUrl = isset($data['logoImageUrl']) ? $conn->real_escape_string($data['logoImageUrl']) : '';
$corporate = isset($data['corporate']) ? intval($data['corporate']) : 0;
$nonCorporate = isset($data['nonCorporate']) ? intval($data['nonCorporate']) : 0;
$youth = isset($data['youth']) ? intval($data['youth']) : 0;
$others = isset($data['others']) ? intval($data['others']) : 0;
$totalMembersAsOf = isset($data['totalMembersAsOf']) ? $conn->real_escape_string($data['totalMembersAsOf']) : '';

$sql = "INSERT INTO locals (id, name, established, facebookUrl, instagramUrl, twitterUrl, heroImageUrl, logoImageUrl, corporate, nonCorporate, youth, others, totalMembersAsOf)
        VALUES ('$id', '$name', '$established', '$facebookUrl', '$instagramUrl', '$twitterUrl', '$heroImageUrl', '$logoImageUrl', $corporate, $nonCorporate, $youth, $others, '$totalMembersAsOf')";

if ($conn->query($sql) === TRUE) {
    sendResponse(['id' => $id, 'message' => 'Local added successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>