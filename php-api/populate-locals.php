<?php
require_once 'config.php';

header('Content-Type: application/json');

$conn = getDatabaseConnection();
if (!$conn) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Define all 19 locals (from frontend data/locals.ts)
$locals = [
    // NORTHERN LUZON REGION
    [
        'id' => 'baguio',
        'name' => 'YMCA of the City of Baguio',
        'established' => 1941,
        'facebook_url' => 'https://www.facebook.com/ymcabaguiocity',
        'corporate' => 1244,
        'non_corporate' => 0,
        'youth' => 769,
        'others' => 0,
        'total_members_as_of' => 2025,
    ],
    [
        'id' => 'tuguegarao',
        'name' => 'YMCA of the City of Tuguegarao',
        'established' => 1957,
        'facebook_url' => 'https://www.facebook.com/ymcatuguegarao/',
        'corporate' => 601,
        'non_corporate' => 42,
        'youth' => 1447,
        'others' => 0,
        'total_members_as_of' => 2025,
    ],
    [
        'id' => 'nueva_ecija',
        'name' => 'YMCA of Nueva Ecija',
        'established' => 1957,
        'facebook_url' => 'https://www.facebook.com/ymca.nuevaecija.2024/',
        'corporate' => 365,
        'non_corporate' => 0,
        'youth' => 647,
        'others' => 0,
        'total_members_as_of' => 2025,
    ],
    [
        'id' => 'pangasinan',
        'name' => 'YMCA of Pangasinan',
        'established' => 1957,
        'facebook_url' => 'https://www.facebook.com/p/YMCA-of-Pangasinan-Inc-100064847794128/',
        'corporate' => 669,
        'non_corporate' => 0,
        'youth' => 725,
        'others' => 0,
        'total_members_as_of' => 2025,
    ],
    
    // MANILA BAY REGION
    [
        'id' => 'makati',
        'name' => 'YMCA of Makati',
        'established' => 1971,
        'facebook_url' => 'https://www.facebook.com/ymcamakati',
        'corporate' => 298,
        'non_corporate' => 1769,
        'youth' => 1735,
        'others' => 0,
        'total_members_as_of' => 2025,
    ],
    [
        'id' => 'manila',
        'name' => 'YMCA of Manila',
        'established' => 1907,
        'facebook_url' => 'https://www.facebook.com/YmcaOfManilaOfficial',
        'corporate' => 737,
        'non_corporate' => 2509,
        'youth' => 16932,
        'others' => 6265,
        'total_members_as_of' => 2025,
    ],
    [
        'id' => 'manila_downtown',
        'name' => 'Manila Downtown YMCA',
        'established' => 1920,
        'facebook_url' => 'https://www.facebook.com/mdymca/',
        'corporate' => 900,
        'non_corporate' => 2314,
        'youth' => 1089,
        'others' => 0,
        'total_members_as_of' => 2025,
    ],
    [
        'id' => 'quezon_city',
        'name' => 'YMCA of Quezon City',
        'established' => 1959,
        'facebook_url' => 'https://www.facebook.com/p/YMCA-of-Quezon-City-Inc-100064587435993/',
        'corporate' => 157,
        'non_corporate' => 0,
        'youth' => 1173,
        'others' => 164,
        'total_members_as_of' => 2025,
    ],
    
    // SOUTHERN LUZON REGION
    [
        'id' => 'albay',
        'name' => 'YMCA of Albay',
        'established' => 1953,
        'facebook_url' => 'https://www.facebook.com/albay.ymca',
        'corporate' => 102,
        'non_corporate' => 0,
        'youth' => 709,
        'others' => 3,
        'total_members_as_of' => 2025,
    ],
    [
        'id' => 'los-banos',
        'name' => 'YMCA of Los Baños',
        'established' => 1923,
        'facebook_url' => 'https://www.facebook.com/ymcalb/',
        'corporate' => 118,
        'non_corporate' => 0,
        'youth' => 711,
        'others' => 214,
        'total_members_as_of' => 2025,
    ],
    [
        'id' => 'nueva_caceres',
        'name' => 'YMCA of Nueva Caceres',
        'established' => 2014,
        'facebook_url' => 'https://www.facebook.com/YMCACamarinesSur/',
        'corporate' => 111,
        'non_corporate' => 0,
        'youth' => 69,
        'others' => 1,
        'total_members_as_of' => 2025,
    ],
    [
        'id' => 'san_pablo',
        'name' => 'YMCA of San Pablo',
        'established' => 1947,
        'facebook_url' => 'https://www.facebook.com/YMCASanPablo',
        'corporate' => 447,
        'non_corporate' => 0,
        'youth' => 6040,
        'others' => 178,
        'total_members_as_of' => 2025,
    ],
    
    // VISAYAS REGION
    [
        'id' => 'cebu',
        'name' => 'YMCA of Cebu',
        'established' => 1926,
        'facebook_url' => 'https://www.facebook.com/ymca.cebu.inc/',
        'corporate' => 311,
        'non_corporate' => 0,
        'youth' => 150,
        'others' => 4185,
        'total_members_as_of' => 2025,
    ],
    [
        'id' => 'leyte',
        'name' => 'YMCA of Leyte',
        'established' => 1976,
        'facebook_url' => 'https://www.facebook.com/ymcaofleyte',
        'corporate' => 286,
        'non_corporate' => 0,
        'youth' => 193,
        'others' => 70,
        'total_members_as_of' => 2025,
    ],
    [
        'id' => 'negros_occidental',
        'name' => 'YMCA of Negros Occidental',
        'established' => 1972,
        'facebook_url' => 'https://www.facebook.com/ymcanegrosoccidental/',
        'corporate' => 182,
        'non_corporate' => 0,
        'youth' => 973,
        'others' => 53,
        'total_members_as_of' => 2025,
    ],
    [
        'id' => 'negros_oriental',
        'name' => 'YMCA of Negros Oriental',
        'established' => 1968,
        'facebook_url' => 'https://www.facebook.com/ymcadumaguete.negrosor/',
        'corporate' => 901,
        'non_corporate' => 0,
        'youth' => 320,
        'others' => 0,
        'total_members_as_of' => 2025,
    ],
    
    // MINDANAO REGION
    [
        'id' => 'cagayan_de_oro',
        'name' => 'YMCA Cagayan de Oro',
        'established' => 1987,
        'facebook_url' => 'https://www.facebook.com/cagayandeoroymca',
        'corporate' => 360,
        'non_corporate' => 0,
        'youth' => 7708,
        'others' => 15,
        'total_members_as_of' => 2025,
    ],
    [
        'id' => 'davao',
        'name' => 'YMCA of Davao',
        'established' => 1971,
        'facebook_url' => 'https://www.facebook.com/ymcanegrosoccidental/',
        'corporate' => 498,
        'non_corporate' => 0,
        'youth' => 1931,
        'others' => 106,
        'total_members_as_of' => 2025,
    ],
    
    // NATIONAL
    [
        'id' => 'philippines',
        'name' => 'YMCA of the Philippines',
        'established' => 1911,
        'facebook_url' => 'https://www.facebook.com/ymcaphilippines1911',
        'corporate' => 0,
        'non_corporate' => 0,
        'youth' => 0,
        'others' => 0,
        'total_members_as_of' => 2025,
    ],
];

$response = [
    'action' => 'POPULATE_LOCALS',
    'results' => [],
    'inserted' => 0,
    'skipped' => 0,
    'errors' => [],
];

foreach ($locals as $local) {
    // Check if local already exists
    $checkSql = "SELECT local_id FROM local WHERE local_id = '" . $conn->real_escape_string($local['id']) . "'";
    $checkResult = $conn->query($checkSql);

    if ($checkResult && $checkResult->num_rows > 0) {
        $response['skipped']++;
        $response['results'][] = [
            'local_id' => $local['id'],
            'status' => 'SKIPPED',
            'reason' => 'Local already exists',
        ];
        continue;
    }

    // Insert the local
    $escapedId = $conn->real_escape_string($local['id']);
    $escapedName = $conn->real_escape_string($local['name']);
    $escapedFacebookUrl = $conn->real_escape_string($local['facebook_url'] ?? '');

    $sql = "INSERT INTO local (local_id, name, established, facebook_url, corporate, non_corporate, youth, others, total_members_as_of) 
            VALUES ('$escapedId', '$escapedName', {$local['established']}, '$escapedFacebookUrl', {$local['corporate']}, {$local['non_corporate']}, {$local['youth']}, {$local['others']}, {$local['total_members_as_of']})";

    if ($conn->query($sql) === TRUE) {
        $response['inserted']++;
        $response['results'][] = [
            'local_id' => $local['id'],
            'status' => 'SUCCESS',
            'message' => 'Local inserted successfully',
        ];
    } else {
        $response['errors'][] = [
            'local_id' => $local['id'],
            'error' => $conn->error,
        ];
        $response['results'][] = [
            'local_id' => $local['id'],
            'status' => 'ERROR',
            'error' => $conn->error,
        ];
    }
}

$response['status'] = count($response['errors']) === 0 ? 'SUCCESS' : 'PARTIAL_SUCCESS';
$response['summary'] = "Inserted: {$response['inserted']}, Skipped: {$response['skipped']}, Errors: " . count($response['errors']);

echo json_encode($response, JSON_PRETTY_PRINT);
?>
