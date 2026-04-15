<?php
// Test script for method override and data parsing
include 'config.php';
include 'utils.php';

echo "=== PHP API Test ===\n";
echo "Request Method: " . ($_SERVER['REQUEST_METHOD'] ?? 'UNKNOWN') . "\n";
echo "Content-Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'not set') . "\n";

$data = getPostData();
echo "Parsed Data: " . json_encode($data) . "\n";

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    echo "News ID: $id\n";

    // Check if news exists
    $result = $conn->query("SELECT * FROM news WHERE id = $id");
    if ($result && $result->num_rows > 0) {
        $news = $result->fetch_assoc();
        echo "News found: " . json_encode($news) . "\n";
    } else {
        echo "News not found\n";
    }
}

echo "=== End Test ===\n";
?>