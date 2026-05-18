<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

logoutAdmin();
sendResponse(['loggedOut' => true]);
