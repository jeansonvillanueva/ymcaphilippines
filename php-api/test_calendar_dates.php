<?php
// Test script to debug calendar dates
require_once 'config.php';

// Get all calendar events
$result = $conn->query("SELECT id, title, start_date, end_date, date FROM calendar_events ORDER BY id DESC LIMIT 5");

if ($result) {
    echo "<h3>Calendar Events (Last 5):</h3>";
    echo "<table border='1' cellpadding='10'>";
    echo "<tr><th>ID</th><th>Title</th><th>Start Date</th><th>End Date</th><th>Legacy Date</th></tr>";
    
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row['id'] . "</td>";
        echo "<td>" . $row['title'] . "</td>";
        echo "<td><strong>" . $row['start_date'] . "</strong></td>";
        echo "<td><strong>" . $row['end_date'] . "</strong></td>";
        echo "<td>" . $row['date'] . "</td>";
        echo "</tr>";
    }
    
    echo "</table>";
    
    echo "<h3>JSON Response (as API would return):</h3>";
    echo "<pre>";
    
    $result = $conn->query("SELECT * FROM calendar_events ORDER BY id DESC LIMIT 1");
    $row = $result->fetch_assoc();
    echo json_encode($row, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    
    echo "</pre>";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>
