<?php

const PILLAR_DEFAULTS = [
    'community' => ['label' => 'Community Wellbeing', 'color' => '#C41E3A'],
    'work' => ['label' => 'Meaningful Work', 'color' => '#C41E3A'],
    'planet' => ['label' => 'Sustainable Planet', 'color' => '#C41E3A'],
    'world' => ['label' => 'Just World', 'color' => '#C41E3A'],
];

const CANONICAL_BULLETS_TABLE = 'local_programs_bullets';
const LEGACY_BULLETS_TABLE = 'local_program_bullets';

function tableHasColumn($conn, $table, $column) {
    $safeTable = preg_replace('/[^a-zA-Z0-9_]/', '', $table);
    $safeColumn = preg_replace('/[^a-zA-Z0-9_]/', '', $column);
    if ($safeTable === '' || $safeColumn === '') {
        return false;
    }

    $result = $conn->query("SHOW COLUMNS FROM `$safeTable` LIKE '$safeColumn'");
    return $result && $result->num_rows > 0;
}

function ensureBulletsTableExists($conn) {
    $result = $conn->query('SHOW TABLES LIKE \'' . CANONICAL_BULLETS_TABLE . '\'');
    if ($result && $result->num_rows > 0) {
        return true;
    }

    $sql = 'CREATE TABLE IF NOT EXISTS `' . CANONICAL_BULLETS_TABLE . '` (
        `bullet_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `program_id` int NOT NULL,
        `bullet_text` text NOT NULL,
        `sequence_order` int DEFAULT 0,
        INDEX idx_program_id (program_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci';

    return $conn->query($sql) === true;
}

/** Create pillar/program tables when missing (production DBs often pre-date this feature). */
function ensureLocalPillarTables($conn) {
    if (!$conn) {
        return false;
    }

    $ok = true;

    $pillarsCheck = $conn->query('SHOW TABLES LIKE \'local_pillars\'');
    if (!$pillarsCheck || $pillarsCheck->num_rows === 0) {
        $sql = 'CREATE TABLE IF NOT EXISTS `local_pillars` (
            `pillars_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
            `local_id` varchar(50) NOT NULL,
            `pillar_key` varchar(32) NOT NULL,
            `label` varchar(100) NOT NULL,
            `color` varchar(20) DEFAULT NULL,
            INDEX idx_local_id (local_id),
            INDEX idx_pillar_key (pillar_key)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci';
        if ($conn->query($sql) !== true) {
            error_log('[ensureLocalPillarTables] local_pillars: ' . $conn->error);
            $ok = false;
        }
    }

    $programsCheck = $conn->query('SHOW TABLES LIKE \'local_programs\'');
    if (!$programsCheck || $programsCheck->num_rows === 0) {
        $sql = 'CREATE TABLE IF NOT EXISTS `local_programs` (
            `program_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
            `pillar_id` int NOT NULL,
            `title` varchar(200) NOT NULL DEFAULT \'\',
            `sequence_order` int DEFAULT 0,
            INDEX idx_pillar_id (pillar_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci';
        if ($conn->query($sql) !== true) {
            error_log('[ensureLocalPillarTables] local_programs: ' . $conn->error);
            $ok = false;
        }
    }

    if (!ensureBulletsTableExists($conn)) {
        error_log('[ensureLocalPillarTables] ' . CANONICAL_BULLETS_TABLE . ' could not be created');
        $ok = false;
    }

    if (!ensureLocalProgramsColumns($conn)) {
        $ok = false;
    }

    return $ok;
}

/** Add columns that older production DBs may be missing (CREATE TABLE IF NOT EXISTS does not alter). */
function ensureLocalProgramsColumns($conn) {
    if (!$conn) {
        return false;
    }

    $ok = true;

    try {
        $programsCheck = $conn->query('SHOW TABLES LIKE \'local_programs\'');
        if ($programsCheck && $programsCheck->num_rows > 0) {
            if (!tableHasColumn($conn, 'local_programs', 'sequence_order')) {
                if ($conn->query('ALTER TABLE `local_programs` ADD COLUMN `sequence_order` int DEFAULT 0') !== true) {
                    error_log('[ensureLocalProgramsColumns] local_programs.sequence_order: ' . $conn->error);
                    $ok = false;
                }
            }
            if (!tableHasColumn($conn, 'local_programs', 'title')) {
                if ($conn->query('ALTER TABLE `local_programs` ADD COLUMN `title` varchar(200) NOT NULL DEFAULT \'\'') !== true) {
                    error_log('[ensureLocalProgramsColumns] local_programs.title: ' . $conn->error);
                    $ok = false;
                }
            }
        }

        foreach ([CANONICAL_BULLETS_TABLE, LEGACY_BULLETS_TABLE] as $table) {
            $tableCheck = $conn->query('SHOW TABLES LIKE \'' . $table . '\'');
            if (!$tableCheck || $tableCheck->num_rows === 0) {
                continue;
            }
            if (!tableHasColumn($conn, $table, 'sequence_order')) {
                if ($conn->query('ALTER TABLE `' . $table . '` ADD COLUMN `sequence_order` int DEFAULT 0') !== true) {
                    error_log('[ensureLocalProgramsColumns] ' . $table . '.sequence_order: ' . $conn->error);
                    $ok = false;
                }
            }
        }
    } catch (Throwable $e) {
        error_log('[ensureLocalProgramsColumns] ' . $e->getMessage());
        $ok = false;
    }

    return $ok;
}

function migrateLegacyBulletsToCanonical($conn) {
    try {
        if (!ensureBulletsTableExists($conn)) {
            return false;
        }

        $legacyCheck = $conn->query('SHOW TABLES LIKE \'' . LEGACY_BULLETS_TABLE . '\'');
        if (!$legacyCheck || $legacyCheck->num_rows === 0) {
            return true;
        }

        if (!tableHasColumn($conn, LEGACY_BULLETS_TABLE, 'program_id')
            || !tableHasColumn($conn, LEGACY_BULLETS_TABLE, 'bullet_text')) {
            error_log('[migrateLegacyBulletsToCanonical] Legacy table missing required columns; skipping migration');
            return true;
        }

        // Older production DBs may not have sequence_order on the legacy table.
        $legacyHasSequence = tableHasColumn($conn, LEGACY_BULLETS_TABLE, 'sequence_order');
        $sequenceSelect = $legacyHasSequence ? 'lb.sequence_order' : '0';
        $dedupeSequence = $legacyHasSequence ? 'cb.sequence_order = lb.sequence_order' : 'cb.sequence_order = 0';

        $sql = 'INSERT INTO `' . CANONICAL_BULLETS_TABLE . '` (program_id, bullet_text, sequence_order)
                SELECT lb.program_id, lb.bullet_text, ' . $sequenceSelect . '
                FROM `' . LEGACY_BULLETS_TABLE . '` lb
                WHERE NOT EXISTS (
                    SELECT 1 FROM `' . CANONICAL_BULLETS_TABLE . '` cb
                    WHERE cb.program_id = lb.program_id
                      AND cb.bullet_text = lb.bullet_text
                      AND ' . $dedupeSequence . '
                )';

        if ($conn->query($sql) !== true) {
            error_log('[migrateLegacyBulletsToCanonical] ' . $conn->error);
            return false;
        }

        return true;
    } catch (Throwable $e) {
        error_log('[migrateLegacyBulletsToCanonical] ' . $e->getMessage());
        return false;
    }
}

function getProgramBulletsTableName($conn) {
    ensureBulletsTableExists($conn);
    migrateLegacyBulletsToCanonical($conn);
    return CANONICAL_BULLETS_TABLE;
}

function countBulletsInPillarsPayload($pillarsPayload) {
    if (!is_array($pillarsPayload)) {
        return 0;
    }

    $count = 0;
    foreach ($pillarsPayload as $pillar) {
        if (!is_array($pillar)) {
            continue;
        }
        foreach ($pillar['programs'] ?? [] as $program) {
            if (!is_array($program)) {
                continue;
            }
            foreach ($program['bullets'] ?? [] as $bullet) {
                if (trim((string)$bullet) !== '') {
                    $count++;
                }
            }
        }
    }

    return $count;
}

function countBulletsInPillarList($pillars) {
    $count = 0;
    foreach ($pillars as $pillar) {
        foreach ($pillar['programs'] ?? [] as $program) {
            $count += count($program['bullets'] ?? []);
        }
    }
    return $count;
}

function resolveBulletsTableForQuery($conn) {
    getProgramBulletsTableName($conn);

    $canonicalCheck = $conn->query('SHOW TABLES LIKE \'' . CANONICAL_BULLETS_TABLE . '\'');
    if ($canonicalCheck && $canonicalCheck->num_rows > 0) {
        return CANONICAL_BULLETS_TABLE;
    }

    $legacyCheck = $conn->query('SHOW TABLES LIKE \'' . LEGACY_BULLETS_TABLE . '\'');
    if ($legacyCheck && $legacyCheck->num_rows > 0) {
        return LEGACY_BULLETS_TABLE;
    }

    return CANONICAL_BULLETS_TABLE;
}

function buildPillarsWithProgramsQuery($conn, $localId, $bulletsTable) {
    $id = $conn->real_escape_string($localId);
    $programsHasSequence = tableHasColumn($conn, 'local_programs', 'sequence_order');
    $bulletsHasSequence = tableHasColumn($conn, $bulletsTable, 'sequence_order');

    $programOrderSelect = $programsHasSequence ? 'pp.sequence_order AS programOrder' : '0 AS programOrder';
    $bulletOrderSelect = $bulletsHasSequence ? 'b.sequence_order AS bulletOrder' : '0 AS bulletOrder';
    $programOrderBy = $programsHasSequence ? 'pp.sequence_order, ' : '';
    $bulletOrderBy = $bulletsHasSequence ? 'b.sequence_order, ' : '';

    return "SELECT p.pillars_id AS pillarId, p.local_id AS localId, p.pillar_key AS `key`, p.label, p.color,
                   pp.program_id AS programId, pp.title AS programTitle, $programOrderSelect,
                   b.bullet_text AS bulletText, $bulletOrderSelect
            FROM local_pillars p
            LEFT JOIN local_programs pp ON p.pillars_id = pp.pillar_id
            LEFT JOIN `$bulletsTable` b ON pp.program_id = b.program_id
            WHERE p.local_id = '$id'
            ORDER BY p.pillars_id, {$programOrderBy}pp.program_id, {$bulletOrderBy}b.bullet_id";
}

function runPillarsWithProgramsQuery($conn, $pillarsQuery) {
    try {
        $result = $conn->query($pillarsQuery);
        if ($result) {
            return $result;
        }
        error_log('[fetchLocalPillarsWithPrograms] Query failed: ' . $conn->error);
    } catch (Throwable $e) {
        error_log('[fetchLocalPillarsWithPrograms] Query exception: ' . $e->getMessage());
    }
    return null;
}

function fetchLocalPillarsWithPrograms($conn, $localId) {
    if (!$conn) {
        return [];
    }

    ensureLocalPillarTables($conn);

    $pillarsTableCheck = $conn->query('SHOW TABLES LIKE \'local_pillars\'');
    if (!$pillarsTableCheck || $pillarsTableCheck->num_rows === 0) {
        return [];
    }

    $bulletsTable = resolveBulletsTableForQuery($conn);
    $pillarsQuery = buildPillarsWithProgramsQuery($conn, $localId, $bulletsTable);
    $pillarsResult = runPillarsWithProgramsQuery($conn, $pillarsQuery);

    if (!$pillarsResult) {
        // Retry with the other bullets table name when hosts still use the legacy table only.
        $alternateTable = $bulletsTable === CANONICAL_BULLETS_TABLE ? LEGACY_BULLETS_TABLE : CANONICAL_BULLETS_TABLE;
        $altCheck = $conn->query('SHOW TABLES LIKE \'' . $alternateTable . '\'');
        if ($altCheck && $altCheck->num_rows > 0) {
            $pillarsQuery = buildPillarsWithProgramsQuery($conn, $localId, $alternateTable);
            $pillarsResult = runPillarsWithProgramsQuery($conn, $pillarsQuery);
        }
    }

    if (!$pillarsResult) {
        return [];
    }

    $pillarMap = [];
    while ($row = $pillarsResult->fetch_assoc()) {
        $pillarId = $row['pillarId'];
        if (!isset($pillarMap[$pillarId])) {
            $pillarMap[$pillarId] = [
                'id' => (int)$pillarId,
                'localId' => $row['localId'],
                'key' => $row['key'],
                'label' => $row['label'],
                'color' => $row['color'],
                'programs' => [],
            ];
        }

        if (!$row['programId']) {
            continue;
        }

        $programId = $row['programId'];
        if (!isset($pillarMap[$pillarId]['programs'][$programId])) {
            $pillarMap[$pillarId]['programs'][$programId] = [
                'id' => (int)$programId,
                'title' => $row['programTitle'] ?? '',
                'bullets' => [],
                'sequenceOrder' => (int)($row['programOrder'] ?? 0),
            ];
        }

        if ($row['bulletText'] !== null && $row['bulletText'] !== '') {
            $pillarMap[$pillarId]['programs'][$programId]['bullets'][] = $row['bulletText'];
        }
    }

    foreach ($pillarMap as &$pillar) {
        $pillar['programs'] = !empty($pillar['programs']) ? array_values($pillar['programs']) : [];
    }

    return array_values($pillarMap);
}

function countCommunityProgramBullets($conn) {
    getProgramBulletsTableName($conn);
    $result = $conn->query('SELECT COUNT(*) AS cnt FROM `' . CANONICAL_BULLETS_TABLE . '`');
    if ($result && ($row = $result->fetch_assoc())) {
        return (int)$row['cnt'];
    }
    return 0;
}

function ensureLocalExists($conn, $localId, $name = null) {
    $escapedLocalId = $conn->real_escape_string($localId);
    $check = $conn->query("SELECT local_id FROM `local` WHERE local_id = '$escapedLocalId' LIMIT 1");
    if ($check && $check->num_rows > 0) {
        return true;
    }

    $displayName = $name ? $conn->real_escape_string($name) : $escapedLocalId;
    $sql = "INSERT INTO `local` (local_id, name, corporate, non_corporate, youth, others)
            VALUES ('$escapedLocalId', '$displayName', 0, 0, 0, 0)";

    return $conn->query($sql) === true;
}

function dedupePillarRows($conn, $localId, $key, $keepPillarId) {
    $escapedLocalId = $conn->real_escape_string($localId);
    $escapedKey = $conn->real_escape_string($key);
    $keepPillarId = (int)$keepPillarId;

    $dupes = $conn->query(
        "SELECT pillars_id FROM local_pillars
         WHERE local_id = '$escapedLocalId' AND pillar_key = '$escapedKey' AND pillars_id != $keepPillarId"
    );

    if (!$dupes) {
        return;
    }

    while ($row = $dupes->fetch_assoc()) {
        $oldId = (int)$row['pillars_id'];
        replacePillarPrograms($conn, $oldId, []);
        $conn->query("DELETE FROM local_pillars WHERE pillars_id = $oldId");
    }
}

function ensurePillarRow($conn, $localId, $key, $label, $color) {
    $escapedLocalId = $conn->real_escape_string($localId);
    $escapedKey = $conn->real_escape_string($key);
    $escapedLabel = $conn->real_escape_string($label);
    $escapedColor = $conn->real_escape_string($color);

    $result = $conn->query(
        "SELECT pillars_id FROM local_pillars WHERE local_id = '$escapedLocalId' AND pillar_key = '$escapedKey' ORDER BY pillars_id ASC LIMIT 1"
    );

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $pillarId = (int)$row['pillars_id'];
        $conn->query(
            "UPDATE local_pillars SET label='$escapedLabel', color='$escapedColor' WHERE pillars_id=$pillarId"
        );
        dedupePillarRows($conn, $localId, $key, $pillarId);
        return $pillarId;
    }

    $sql = "INSERT INTO local_pillars (local_id, pillar_key, label, color)
            VALUES ('$escapedLocalId', '$escapedKey', '$escapedLabel', '$escapedColor')";
    if ($conn->query($sql) !== true) {
        return null;
    }

    return (int)$conn->insert_id;
}

function deleteBulletsForProgram($conn, $programId) {
    $programId = (int)$programId;
    $bulletsTable = getProgramBulletsTableName($conn);
    $conn->query("DELETE FROM `$bulletsTable` WHERE program_id = $programId");

    $legacyCheck = $conn->query('SHOW TABLES LIKE \'' . LEGACY_BULLETS_TABLE . '\'');
    if ($legacyCheck && $legacyCheck->num_rows > 0) {
        $conn->query('DELETE FROM `' . LEGACY_BULLETS_TABLE . '` WHERE program_id = ' . $programId);
    }
}

function replacePillarPrograms($conn, $pillarId, $programs) {
    $programsTableCheck = $conn->query('SHOW TABLES LIKE \'local_programs\'');
    if (!$programsTableCheck || $programsTableCheck->num_rows === 0) {
        return ['error' => 'Table local_programs is missing. Open /php-api/database-init.php?action=create on your server.'];
    }

    $bulletsTable = resolveBulletsTableForQuery($conn);
    $pillarId = (int)$pillarId;

    $existing = $conn->query("SELECT program_id FROM local_programs WHERE pillar_id = $pillarId");
    if ($existing) {
        while ($row = $existing->fetch_assoc()) {
            $programId = (int)$row['program_id'];
            deleteBulletsForProgram($conn, $programId);
            $conn->query("DELETE FROM local_programs WHERE program_id = $programId");
        }
    }

    if (!is_array($programs)) {
        return null;
    }

    $order = 0;
    foreach ($programs as $program) {
        if (!is_array($program)) {
            continue;
        }

        $bullets = isset($program['bullets']) && is_array($program['bullets']) ? $program['bullets'] : [];
        $normalizedBullets = [];
        foreach ($bullets as $bullet) {
            $text = trim((string)$bullet);
            if ($text !== '') {
                $normalizedBullets[] = $text;
            }
        }

        if (empty($normalizedBullets)) {
            continue;
        }

        $title = isset($program['title']) ? $conn->real_escape_string(trim((string)$program['title'])) : '';
        $programsHasSequence = tableHasColumn($conn, 'local_programs', 'sequence_order');
        $programsHasTitle = tableHasColumn($conn, 'local_programs', 'title');
        $bulletsHasSequence = tableHasColumn($conn, $bulletsTable, 'sequence_order');

        if ($programsHasTitle && $programsHasSequence) {
            $sql = "INSERT INTO local_programs (pillar_id, title, sequence_order) VALUES ($pillarId, '$title', $order)";
        } elseif ($programsHasTitle) {
            $sql = "INSERT INTO local_programs (pillar_id, title) VALUES ($pillarId, '$title')";
        } elseif ($programsHasSequence) {
            $sql = "INSERT INTO local_programs (pillar_id, sequence_order) VALUES ($pillarId, $order)";
        } else {
            $sql = "INSERT INTO local_programs (pillar_id) VALUES ($pillarId)";
        }

        try {
            if ($conn->query($sql) !== true) {
                return ['error' => 'Failed to save program: ' . $conn->error];
            }
        } catch (Throwable $e) {
            return ['error' => 'Failed to save program: ' . $e->getMessage()];
        }

        $programId = (int)$conn->insert_id;
        $bulletOrder = 0;
        foreach ($normalizedBullets as $bulletText) {
            $escapedBullet = $conn->real_escape_string($bulletText);
            if ($bulletsHasSequence) {
                $insertSql = "INSERT INTO `$bulletsTable` (program_id, bullet_text, sequence_order)
                              VALUES ($programId, '$escapedBullet', $bulletOrder)";
            } else {
                $insertSql = "INSERT INTO `$bulletsTable` (program_id, bullet_text)
                              VALUES ($programId, '$escapedBullet')";
            }

            try {
                $insertBullet = $conn->query($insertSql);
                if ($insertBullet !== true) {
                    return ['error' => 'Failed to save program bullet: ' . $conn->error];
                }
            } catch (Throwable $e) {
                return ['error' => 'Failed to save program bullet: ' . $e->getMessage()];
            }
            $bulletOrder++;
        }

        $order++;
    }

    return null;
}

function saveLocalPillarPrograms($conn, $localId, $pillarsPayload, $localName = null) {
    if (!is_array($pillarsPayload)) {
        return ['error' => 'Invalid pillars payload'];
    }

    if (!$conn) {
        return ['error' => 'Database connection failed'];
    }

    if (!ensureLocalPillarTables($conn)) {
        return [
            'error' => 'Program tables are missing on the server. Open /php-api/database-init.php in your browser to create them, then try again.',
        ];
    }

    if (!ensureLocalExists($conn, $localId, $localName)) {
        return ['error' => 'Local YMCA record could not be created: ' . $conn->error];
    }

    $sentBulletCount = countBulletsInPillarsPayload($pillarsPayload);

    $payloadByKey = [];
    foreach ($pillarsPayload as $pillar) {
        if (!is_array($pillar) || empty($pillar['key'])) {
            continue;
        }
        $payloadByKey[$pillar['key']] = $pillar;
    }

    foreach (PILLAR_DEFAULTS as $key => $defaults) {
        $pillar = $payloadByKey[$key] ?? ['key' => $key];
        $label = isset($pillar['label']) && $pillar['label'] !== ''
            ? (string)$pillar['label']
            : $defaults['label'];
        $color = isset($pillar['color']) && $pillar['color'] !== ''
            ? (string)$pillar['color']
            : $defaults['color'];
        $programs = isset($pillar['programs']) && is_array($pillar['programs']) ? $pillar['programs'] : [];

        $pillarId = ensurePillarRow($conn, $localId, $key, $label, $color);
        if ($pillarId === null) {
            return ['error' => $conn->error ?: 'Failed to ensure pillar row'];
        }

        $replaceError = replacePillarPrograms($conn, $pillarId, $programs);
        if (is_array($replaceError) && isset($replaceError['error'])) {
            return $replaceError;
        }
    }

    $savedPillars = fetchLocalPillarsWithPrograms($conn, $localId);
    $savedBulletCount = countBulletsInPillarList($savedPillars);

    if ($sentBulletCount > 0 && $savedBulletCount === 0) {
        return [
            'error' => 'Programs were not saved to the database. Ensure table local_programs_bullets exists and php-api is updated.',
            'sentBulletCount' => $sentBulletCount,
            'savedBulletCount' => $savedBulletCount,
        ];
    }

    return [
        'pillars' => $savedPillars,
        'sentBulletCount' => $sentBulletCount,
        'savedBulletCount' => $savedBulletCount,
    ];
}
