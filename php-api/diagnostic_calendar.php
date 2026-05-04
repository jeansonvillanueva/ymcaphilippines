<?php
// Diagnostic script to check database schema and test event creation
require_once 'config.php';

$conn = getDatabaseConnection();

echo "<h2>🔍 Calendar Events Database Diagnostic</h2>";

// 1. Check if table exists
echo "<h3>1. Table Check</h3>";
$result = $conn->query("SHOW TABLES LIKE 'calendar_events'");
if ($result && $result->num_rows > 0) {
    echo "✅ Table <code>calendar_events</code> exists<br>";
} else {
    echo "❌ Table <code>calendar_events</code> NOT FOUND<br>";
    die("Cannot continue - table missing");
}

// 2. Check columns
echo "<h3>2. Column Check</h3>";
$result = $conn->query("DESCRIBE calendar_events");
echo "<table border='1' cellpadding='10'>";
echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";

$requiredColumns = ['start_date', 'end_date', 'title', 'description', 'imageUrl'];
$foundColumns = [];

while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>";
    if (in_array($row['Field'], $requiredColumns)) {
        echo "✅ " . $row['Field'];
        $foundColumns[] = $row['Field'];
    } else {
        echo $row['Field'];
    }
    echo "</td>";
    echo "<td>" . $row['Type'] . "</td>";
    echo "<td>" . $row['Null'] . "</td>";
    echo "<td>" . $row['Key'] . "</td>";
    echo "<td>" . $row['Default'] . "</td>";
    echo "<td>" . $row['Extra'] . "</td>";
    echo "</tr>";
}
echo "</table>";

// Check for missing columns
echo "<h3>3. Missing Columns Check</h3>";
$missingColumns = array_diff($requiredColumns, $foundColumns);
if (empty($missingColumns)) {
    echo "✅ All required columns exist!<br>";
} else {
    echo "❌ Missing columns: <strong>" . implode(", ", $missingColumns) . "</strong><br>";
    echo "<pre>Run this SQL to add missing columns:\n";
    echo "ALTER TABLE calendar_events\n";
    foreach ($missingColumns as $col) {
        if ($col === 'start_date') {
            echo "  ADD COLUMN start_date DATE,\n";
        } elseif ($col === 'end_date') {
            echo "  ADD COLUMN end_date DATE,\n";
        }
    }
    echo "ADD INDEX idx_start_date (start_date);</pre>";
}

// 4. Sample data
echo "<h3>4. Current Events</h3>";
$result = $conn->query("SELECT id, title, start_date, end_date, date, created_at FROM calendar_events ORDER BY id DESC LIMIT 5");
if ($result && $result->num_rows > 0) {
    echo "<table border='1' cellpadding='10'>";
    echo "<tr><th>ID</th><th>Title</th><th>Start Date</th><th>End Date</th><th>Legacy Date</th><th>Created</th></tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row['id'] . "</td>";
        echo "<td>" . $row['title'] . "</td>";
        echo "<td>" . ($row['start_date'] ?? 'NULL') . "</td>";
        echo "<td>" . ($row['end_date'] ?? 'NULL') . "</td>";
        echo "<td>" . ($row['date'] ?? 'NULL') . "</td>";
        echo "<td>" . ($row['created_at'] ?? 'NULL') . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "❌ No events found in database<br>";
}

// 5. API endpoint test
echo "<h3>5. API Endpoint Test</h3>";
echo "<p>Test if the public API returns events:</p>";
echo "<code>https://ymca.ph/testsite/php-api/index.php?path=/api/calendar</code><br>";
echo "<a href='index.php?path=/api/calendar' target='_blank'>Click here to test</a>";

$conn->close();
?>
