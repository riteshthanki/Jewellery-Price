<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$dataFile = 'data/store.json';
$uploadDir = 'data/uploads/';

// Ensure directories exist
if (!file_exists('data')) {
    mkdir('data', 0777, true);
}
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Initialize Data File if not exists
if (!file_exists($dataFile)) {
    $initialData = [
        'rates' => [],
        'settings' => [],
        'mediaItems' => []
    ];
    file_put_contents($dataFile, json_encode($initialData, JSON_PRETTY_PRINT));
}

// Helper to get data
function getData() {
    global $dataFile;
    if (file_exists($dataFile)) {
        return json_decode(file_get_contents($dataFile), true);
    }
    return ['rates' => [], 'settings' => [], 'mediaItems' => []];
}

// Helper to save data
function saveData($data) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_REQUEST['action'] ?? '';

// Handle GET request for data
if ($method === 'GET' && $action === 'get_data') {
    echo json_encode(getData());
    exit;
}

// Handle POST requests
if ($method === 'POST') {
    $data = getData();

    switch ($action) {
        case 'save_rates':
            $rates = json_decode($_POST['rates'], true);
            if ($rates) {
                $data['rates'] = $rates;
                saveData($data);
                echo json_encode(['success' => true]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid rates data']);
            }
            break;

        case 'save_settings':
            $settings = json_decode($_POST['settings'], true);
            if ($settings) {
                $data['settings'] = $settings;
                saveData($data);
                echo json_encode(['success' => true]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid settings data']);
            }
            break;

        case 'save_media':
            $mediaItems = json_decode($_POST['mediaItems'], true);
            if (is_array($mediaItems)) {
                $data['mediaItems'] = $mediaItems;
                saveData($data);
                echo json_encode(['success' => true]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid media data']);
            }
            break;

        case 'upload_file':
            if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES['file'];
                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = uniqid() . '_' . time() . '.' . $ext;
                $targetPath = $uploadDir . $filename;

                if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                    // Return the web-accessible path (relative)
                    echo json_encode(['success' => true, 'url' => $targetPath]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to move uploaded file']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'No file uploaded or upload error']);
            }
            break;

        case 'delete_file':
            $url = $_POST['url'] ?? '';
            if ($url) {
                // Security check: ensure we only delete files in our upload dir
                $filename = basename($url);
                $filePath = $uploadDir . $filename;
                
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
                echo json_encode(['success' => true]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'No URL provided']);
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
    exit;
}

// Default response
echo json_encode(['status' => 'API is running']);
?>