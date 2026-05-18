<?php
// POST /api/feedback
$data = getPostData();

validateRequired($data, ['name', 'email']);

$name = $conn->real_escape_string($data['name']);
$surname = isset($data['surname']) ? $conn->real_escape_string($data['surname']) : '';
$email = $conn->real_escape_string($data['email']);
$message = isset($data['message']) ? $conn->real_escape_string($data['message']) : '';

// Normalize phone field
$phone = '';
if (isset($data['phone_number'])) {
    $phone = $conn->real_escape_string($data['phone_number']);
} elseif (isset($data['phone_num'])) {
    $phone = $conn->real_escape_string($data['phone_num']);
}

$sql = "INSERT INTO feedback (name, surname, email, phone_number, message)
        VALUES ('$name', '$surname', '$email', '$phone', '$message')";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Feedback submitted successfully', 'id' => $conn->insert_id]);
} else {
    // Try fallback to phone_num if phone_number fails
    if (strpos($conn->error, 'phone_number') !== false) {
        $sql = "INSERT INTO feedback (name, surname, email, phone_num, message)
                VALUES ('$name', '$surname', '$email', '$phone', '$message')";
        if ($conn->query($sql) === TRUE) {
            sendResponse(['message' => 'Feedback submitted successfully', 'id' => $conn->insert_id]);
        } else {
            sendResponse(['error' => 'Failed to submit feedback', 'details' => $conn->error], 500);
        }
    } else {
        sendResponse(['error' => 'Failed to submit feedback', 'details' => $conn->error], 500);
    }
}
?>