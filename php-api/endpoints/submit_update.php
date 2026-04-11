<?php
// POST /api/submit-update
$data = getPostData();

validateRequired($data, ['name', 'local_ymca', 'title', 'subtitle', 'articleUrl', 'email']);

$name = $conn->real_escape_string($data['name']);
$local_ymca = $conn->real_escape_string($data['local_ymca']);
$title = $conn->real_escape_string($data['title']);
$subtitle = $conn->real_escape_string($data['subtitle']);
$articleUrl = $conn->real_escape_string($data['articleUrl']);
$email = $conn->real_escape_string($data['email']);
$message = isset($data['message']) ? $conn->real_escape_string($data['message']) : '';

$sql = "INSERT INTO submit_article (name, local_ymca, title, subtitle, article_link, email, message)
        VALUES ('$name', '$local_ymca', '$title', '$subtitle', '$articleUrl', '$email', '$message')";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Submitted successfully', 'id' => $conn->insert_id]);
} else {
    sendResponse(['error' => 'Failed to submit article', 'details' => $conn->error], 500);
}
?>