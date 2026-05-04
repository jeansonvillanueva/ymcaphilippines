<?php
// Debug script to see what data is being received
error_log("=== CALENDAR CREATE DEBUG ===");
error_log("REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD']);
error_log("CONTENT_TYPE: " . ($_SERVER['CONTENT_TYPE'] ?? 'NOT SET'));
error_log("_POST: " . json_encode($_POST, JSON_PRETTY_PRINT));
error_log("_FILES: " . json_encode(array_keys($_FILES), JSON_PRETTY_PRINT));

// Check raw input
$rawInput = file_get_contents('php://input');
error_log("Raw input length: " . strlen($rawInput));
error_log("Raw input preview (first 500 chars): " . substr($rawInput, 0, 500));

// Check what getPostData returns
require_once 'utils.php';
$data = getPostData();
error_log("getPostData result: " . json_encode($data, JSON_PRETTY_PRINT));

// Also log what the actual fields are
error_log("Checking specific fields:");
error_log("title: " . (isset($_POST['title']) ? $_POST['title'] : 'NOT IN $_POST'));
error_log("startDate: " . (isset($_POST['startDate']) ? $_POST['startDate'] : 'NOT IN $_POST'));
error_log("endDate: " . (isset($_POST['endDate']) ? $_POST['endDate'] : 'NOT IN $_POST'));

echo "<h3>Debug logged to PHP error log. Check your hosting's error logs for details.</h3>";
echo "<p>REQUEST_METHOD: " . htmlspecialchars($_SERVER['REQUEST_METHOD']) . "</p>";
echo "<p>CONTENT_TYPE: " . htmlspecialchars($_SERVER['CONTENT_TYPE'] ?? 'NOT SET') . "</p>";
echo "<p>_POST fields: " . implode(", ", array_keys($_POST)) . "</p>";
echo "<p>_FILES: " . implode(", ", array_keys($_FILES)) . "</p>";
?>
