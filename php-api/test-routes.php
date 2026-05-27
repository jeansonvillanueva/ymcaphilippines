<?php
// Test route verification script
echo json_encode([
    'test_delete_all_images_exists' => file_exists(__DIR__ . '/endpoints/admin_news_delete_all_images.php'),
    'test_upload_images_exists' => file_exists(__DIR__ . '/endpoints/admin_news_upload_images.php'),
    'test_path' => '/n2r8k5j9m1/news/15/upload',
    'test_pattern_match' => (bool)preg_match('/^(\/n2r8k5j9m1\/news\/(\d+)\/upload|\/admin\/news\/(\d+)\/upload)$/', '/n2r8k5j9m1/news/15/upload'),
    'test_delete_pattern_match' => (bool)preg_match('/^(\/n2r8k5j9m1\/news\/(\d+)\/images\/all|\/admin\/news\/(\d+)\/images\/all)$/', '/n2r8k5j9m1/news/15/images/all'),
]);
?>
