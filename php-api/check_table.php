<?php
include 'config.php';

echo "=== Database Table Check ===\n";

// Check news table structure
$result = $conn->query("DESCRIBE news");
if ($result) {
    echo "News table columns:\n";
    while ($row = $result->fetch_assoc()) {
        echo "- {$row['Field']}: {$row['Type']} ({$row['Null']}) Default: {$row['Default']}\n";
    }
} else {
    echo "Error describing news table: " . $conn->error . "\n";
}

// Check if news exists
$result = $conn->query("SELECT COUNT(*) as count FROM news");
if ($result) {
    $row = $result->fetch_assoc();
    echo "Total news items: {$row['count']}\n";
} else {
    echo "Error counting news: " . $conn->error . "\n";
}

echo "=== End Check ===\n";
?>