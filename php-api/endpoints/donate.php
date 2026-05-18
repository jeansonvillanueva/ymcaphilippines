<?php
// POST /api/donate
$data = getPostData();

validateRequired($data, ['name', 'surname', 'email', 'amountUsd', 'currency']);

$name = $conn->real_escape_string($data['name']);
$surname = $conn->real_escape_string($data['surname']);
$email = $conn->real_escape_string($data['email']);
$phone = isset($data['phone']) ? $conn->real_escape_string($data['phone']) : '';
$amountUsd = floatval($data['amountUsd']);
$currency = $conn->real_escape_string($data['currency']);
$paymentMethod = isset($data['paymentMethod']) ? $conn->real_escape_string($data['paymentMethod']) : '';
$country = isset($data['country']) ? $conn->real_escape_string($data['country']) : '';
$address1 = isset($data['address1']) ? $conn->real_escape_string($data['address1']) : '';
$address2 = isset($data['address2']) ? $conn->real_escape_string($data['address2']) : '';
$city = isset($data['city']) ? $conn->real_escape_string($data['city']) : '';
$region = isset($data['region']) ? $conn->real_escape_string($data['region']) : '';
$zip = isset($data['zip']) ? $conn->real_escape_string($data['zip']) : '';
$comments = isset($data['comments']) ? $conn->real_escape_string($data['comments']) : '';

$sql = "INSERT INTO donations (name, surname, email, phone, amount_usd, currency, payment_method, country, address1, address2, city, region, zip, comments)
        VALUES ('$name', '$surname', '$email', '$phone', $amountUsd, '$currency', '$paymentMethod', '$country', '$address1', '$address2', '$city', '$region', '$zip', '$comments')";

if ($conn->query($sql) === TRUE) {
    sendResponse(['message' => 'Donation submitted successfully', 'id' => $conn->insert_id]);
} else {
    sendResponse(['error' => 'Failed to submit donation', 'details' => $conn->error], 500);
}
?>