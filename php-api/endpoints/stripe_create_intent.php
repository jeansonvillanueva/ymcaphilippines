<?php
// POST /api/stripe/create-payment-intent
// Creates a Stripe PaymentIntent for donation processing

require_once __DIR__ . '/../config.php';

// Get Stripe secret key from config or environment
$stripeSecretKey = $_ENV['STRIPE_SECRET_KEY'] ?? 'sk_test_YOUR_KEY_HERE';

if (strpos($stripeSecretKey, 'YOUR_KEY') !== false) {
    sendResponse(['error' => 'Stripe API key not configured'], 500);
    exit;
}

// Include Stripe PHP library
require_once __DIR__ . '/../vendor/autoload.php';
\Stripe\Stripe::setApiKey($stripeSecretKey);

$data = getPostData();

validateRequired($data, ['amountUsd', 'email', 'name']);

$amountUsd = floatval($data['amountUsd']);
$email = $conn->real_escape_string($data['email']);
$name = $conn->real_escape_string($data['name']);
$currency = strtolower($data['currency'] ?? 'usd');

// Convert amount to cents
$amountInCents = intval($amountUsd * 100);

if ($amountInCents < 50) {
    sendResponse(['error' => 'Minimum donation is $0.50'], 400);
    exit;
}

try {
    // Create Stripe PaymentIntent
    $intent = \Stripe\PaymentIntent::create([
        'amount' => $amountInCents,
        'currency' => $currency,
        'payment_method_types' => ['card'],
        'metadata' => [
            'donor_name' => $name,
            'donor_email' => $email,
        ],
        'receipt_email' => $email, // Send receipt to donor
    ]);

    sendResponse([
        'clientSecret' => $intent->client_secret,
        'paymentIntentId' => $intent->id,
    ]);
} catch (\Stripe\Exception\ApiErrorException $e) {
    error_log('Stripe API Error: ' . $e->getMessage());
    sendResponse(['error' => 'Failed to create payment intent', 'details' => $e->getMessage()], 500);
}
?>
