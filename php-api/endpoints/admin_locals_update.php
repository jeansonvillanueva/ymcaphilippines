<?php
// PUT /admin/locals/:id
$data = getPostData();
$id = $conn->real_escape_string($_GET['id']);

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

$sql = "UPDATE locals SET name='$name', established='$established', facebookUrl='$facebookUrl', instagramUrl='$instagramUrl', twitterUrl='$twitterUrl', heroImageUrl='$heroImageUrl', logoImageUrl='$logoImageUrl', corporate=$corporate, nonCorporate=$nonCorporate, youth=$youth, others=$others, totalMembersAsOf='$totalMembersAsOf' WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Local updated successfully']);
} else {
    sendResponse(['error' => $conn->error], 500);
}
?>