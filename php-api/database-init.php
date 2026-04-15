<?php
require_once 'config.php';

header('Content-Type: application/json');

// Check if form submitted to create tables
$action = $_GET['action'] ?? $_POST['action'] ?? '';

if ($action !== 'create') {
    // Just show status
    $response = [
        'status' => 'Database Schema Check',
        'database' => 'ymcaph_db',
        'tables' => [],
    ];

    // Get list of tables
    $result = $conn->query("SHOW TABLES");
    if ($result) {
        while ($row = $result->fetch_row()) {
            $response['tables'][] = $row[0];
        }
    }

    // Check which tables exist
    $response['table_status'] = [
        'local' => in_array('local', $response['tables']),
        'local_pillars' => in_array('local_pillars', $response['tables']),
        'local_programs' => in_array('local_programs', $response['tables']),
        'local_programs_bullets' => in_array('local_programs_bullets', $response['tables']),
    ];

    // Indicate next action
    if (!$response['table_status']['local']) {
        $response['action_needed'] = 'CREATE_TABLES';
        $response['next_step'] = 'Visit: ?action=create to create all missing tables';
    } else {
        $response['action_needed'] = 'NONE';
        $response['next_step'] = 'All tables exist. System ready to use.';
    }

    echo json_encode($response, JSON_PRETTY_PRINT);
    exit;
}

// CREATE ACTION - Create all missing tables
if ($action === 'create') {
    $queries = [
        "CREATE TABLE IF NOT EXISTS `local` (
          `local_id` varchar(50) NOT NULL PRIMARY KEY,
          `name` varchar(200) NOT NULL,
          `established` year DEFAULT NULL,
          `facebook_url` varchar(255) DEFAULT NULL,
          `hero_image_url` varchar(255) DEFAULT NULL,
          `logo_image_url` varchar(255) DEFAULT NULL,
          `corporate` int DEFAULT 0,
          `non_corporate` int DEFAULT 0,
          `youth` int DEFAULT 0,
          `others` int DEFAULT 0,
          `total_members_as_of` year DEFAULT NULL,
          `instagramUrl` varchar(500) DEFAULT NULL,
          `twitterUrl` varchar(500) DEFAULT NULL,
          INDEX idx_local_id (local_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",

        "CREATE TABLE IF NOT EXISTS `local_pillars` (
          `pillars_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
          `local_id` varchar(50) NOT NULL,
          `pillar_key` enum('community', 'work', 'planet', 'world') NOT NULL,
          `label` varchar(100) NOT NULL,
          `color` varchar(20) DEFAULT NULL,
          INDEX idx_local_id (local_id),
          INDEX idx_pillar_key (pillar_key),
          CONSTRAINT fk_local_id_pillars FOREIGN KEY (local_id) REFERENCES `local`(local_id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",

        "CREATE TABLE IF NOT EXISTS `local_programs` (
          `program_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
          `pillar_id` int NOT NULL,
          `title` varchar(200) NOT NULL,
          `sequence_order` int DEFAULT 0,
          INDEX idx_pillar_id (pillar_id),
          CONSTRAINT fk_pillar_id_programs FOREIGN KEY (pillar_id) REFERENCES `local_pillars`(pillars_id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci",

        "CREATE TABLE IF NOT EXISTS `local_programs_bullets` (
          `bullet_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
          `program_id` int NOT NULL,
          `bullet_text` text NOT NULL,
          `sequence_order` int DEFAULT 0,
          INDEX idx_program_id (program_id),
          CONSTRAINT fk_program_id_bullets FOREIGN KEY (program_id) REFERENCES `local_programs`(program_id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci"
    ];

    $response = [
        'action' => 'CREATE_TABLES',
        'results' => [],
    ];

    foreach ($queries as $i => $sql) {
        $result = $conn->query($sql);
        $response['results'][] = [
            'query_number' => $i + 1,
            'success' => $result === TRUE,
            'error' => $conn->error ?: null,
        ];
    }

    // Final status check
    $tableResult = $conn->query("SHOW TABLES");
    $tables = [];
    if ($tableResult) {
        while ($row = $tableResult->fetch_row()) {
            $tables[] = $row[0];
        }
    }

    $response['all_tables_created'] = [
        'local' => in_array('local', $tables),
        'local_pillars' => in_array('local_pillars', $tables),
        'local_programs' => in_array('local_programs', $tables),
        'local_programs_bullets' => in_array('local_programs_bullets', $tables),
    ];

    $allCreated = array_reduce($response['all_tables_created'], function($carry, $item) {
        return $carry && $item;
    }, true);

    $response['status'] = $allCreated ? 'SUCCESS: All tables created' : 'ERROR: Some tables failed to create';
    $response['next_step'] = $allCreated ? 'System ready! Available at: /admin' : 'Check errors above and retry';

    echo json_encode($response, JSON_PRETTY_PRINT);
    exit;
}

echo json_encode(['error' => 'Invalid action'], 400);
?>
