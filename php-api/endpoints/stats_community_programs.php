<?php
// GET /api/stats/community-programs
require_once __DIR__ . '/../pillars_helper.php';

$count = countCommunityProgramBullets($conn);
sendResponse(['count' => $count]);
?>
