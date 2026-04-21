<?php
require_once 'config.php';

echo "Running migration: Add contentBlocks column to news table\n";

$sql = 'ALTER TABLE news ADD COLUMN IF NOT EXISTS contentBlocks JSON DEFAULT (\'[]\')';
$result = $conn->query($sql);

if ($result) {
    echo "Migration successful: contentBlocks column added to news table\n";
} else {
    echo "Migration failed: " . $conn->error . "\n";
}

$conn->close();
?>