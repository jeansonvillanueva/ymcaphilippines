<?php
// POST /api/stripe/confirm-payment
// Confirms payment and saves donation to database

require_once __DIR__ . '/../config.php';

$stripeSecretKey = $_ENV['STRIPE_SECRET_KEY'] ?? 'sk_test_YOUR_KEY_HERE';

if (strpos($stripeSecretKey, 'YOUR_KEY') !== false) {
    sendResponse(['error' => 'Stripe API key not configured'], 500);
    exit;
}

require_once __DIR__ . '/../vendor/autoload.php';
\Stripe\Stripe::setApiKey($stripeSecretKey);

$data = getPostData();

validateRequired($data, ['paymentIntentId', 'name', 'surname', 'email', 'amountUsd']);

$paymentIntentId = $conn->real_escape_string($data['paymentIntentId']);
$name = $conn->real_escape_string($data['name']);
$surname = $conn->real_escape_string($data['surname']);
$email = $conn->real_escape_string($data['email']);
$amountUsd = floatval($data['amountUsd']);
$currency = $conn->real_escape_string($data['currency'] ?? 'USD');
$paymentMethod = $conn->real_escape_string($data['paymentMethod'] ?? 'Stripe');
$phone = isset($data['phone']) ? $conn->real_escape_string($data['phone']) : '';
$country = isset($data['country']) ? $conn->real_escape_string($data['country']) : '';
$address1 = isset($data['address1']) ? $conn->real_escape_string($data['address1']) : '';
$address2 = isset($data['address2']) ? $conn->real_escape_string($data['address2']) : '';
$city = isset($data['city']) ? $conn->real_escape_string($data['city']) : '';
$region = isset($data['region']) ? $conn->real_escape_string($data['region']) : '';
$zip = isset($data['zip']) ? $conn->real_escape_string($data['zip']) : '';
$comments = isset($data['comments']) ? $conn->real_escape_string($data['comments']) : '';

try {
    // Retrieve the PaymentIntent from Stripe
    $intent = \Stripe\PaymentIntent::retrieve($paymentIntentId);

    // Check if payment succeeded
    if ($intent->status !== 'succeeded') {
        sendResponse(['error' => 'Payment was not successful', 'status' => $intent->status], 400);
        exit;
    }

    // Save donation to database
    $sql = "INSERT INTO donations (name, surname, email, phone, amount_usd, currency, payment_method, country, address1, address2, city, region, zip, comments, payment_intent_id, status)
            VALUES ('$name', '$surname', '$email', '$phone', $amountUsd, '$currency', '$paymentMethod', '$country', '$address1', '$address2', '$city', '$region', '$zip', '$comments', '$paymentIntentId', 'completed')";

    if ($conn->query($sql) === TRUE) {
        sendResponse([
            'message' => 'Donation completed successfully',
            'id' => $conn->insert_id,
            'amount' => $amountUsd,
            'currency' => $currency,
        ]);
    } else {
        // Payment succeeded but database save failed - log for manual review
        error_log("Payment succeeded but database save failed for PaymentIntent: $paymentIntentId. Error: " . $conn->error);
        sendResponse([
            'message' => 'Payment received but please contact support to confirm donation details',
            'paymentIntentId' => $paymentIntentId,
        ], 500);
    }
} catch (\Stripe\Exception\ApiErrorException $e) {
    error_log('Stripe API Error: ' . $e->getMessage());
    sendResponse(['error' => 'Failed to confirm payment', 'details' => $e->getMessage()], 500);
}
?>
