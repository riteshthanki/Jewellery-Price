<?php
header('Content-Type: application/json');

$dataFile = 'data.json';
$uploadDir = 'uploads/';

// Ensure upload directory exists
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Load current data
$data = json_decode(file_get_contents($dataFile), true);

if (!$data) {
    // Fallback if empty
    $data = ['rates' => [], 'media' => [], 'settings' => ['shopName' => 'Jay Mataji Jewellers', 'logoUrl' => '']];
}

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'update_rates':
        $updatedRates = json_decode($_POST['rates'], true);
        if ($updatedRates) {
            $data['rates'] = $updatedRates;
            file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['success' => true, 'message' => 'Rates updated']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid data']);
        }
        break;

    case 'update_settings':
        $updatedSettings = json_decode($_POST['settings'], true);
        if ($updatedSettings) {
            $data['settings'] = $updatedSettings;
            file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['success' => true, 'message' => 'Settings updated']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid data']);
        }
        break;

    case 'upload_logo':
        if (!empty($_FILES['logo'])) {
             $file = $_FILES['logo'];
             if ($file['error'] === UPLOAD_ERR_OK) {
                 $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                 // Create unique name but keep extension
                 $filename = 'logo_' . uniqid() . '.' . $ext;
                 $targetPath = $uploadDir . $filename;
                 
                 if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                     echo json_encode(['success' => true, 'url' => $targetPath]);
                 } else {
                     echo json_encode(['success' => false, 'message' => 'Move failed']);
                 }
             } else {
                 echo json_encode(['success' => false, 'message' => 'Upload error']);
             }
        } else {
            echo json_encode(['success' => false, 'message' => 'No file uploaded']);
        }
        break;

    case 'upload_media':
        if (!empty($_FILES['files'])) {
            $newMedia = [];
            foreach ($_FILES['files']['name'] as $key => $name) {
                if ($_FILES['files']['error'][$key] === UPLOAD_ERR_OK) {
                    $tmpName = $_FILES['files']['tmp_name'][$key];
                    $ext = pathinfo($name, PATHINFO_EXTENSION);
                    $filename = uniqid() . '.' . $ext;
                    $targetPath = $uploadDir . $filename;
                    
                    if (move_uploaded_file($tmpName, $targetPath)) {
                        $mime = mime_content_type($targetPath);
                        $type = (strpos($mime, 'video') !== false) ? 'video' : 'image';
                        
                        $newMedia[] = [
                            'id' => uniqid(),
                            'type' => $type,
                            'url' => $targetPath,
                            'title' => pathinfo($name, PATHINFO_FILENAME)
                        ];
                    }
                }
            }
            
            $data['media'] = array_merge($data['media'], $newMedia);
            file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['success' => true, 'media' => $data['media']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No files uploaded']);
        }
        break;

    case 'delete_media':
        $idToDelete = $_POST['id'] ?? '';
        $filteredMedia = [];
        foreach ($data['media'] as $item) {
            if ($item['id'] === $idToDelete) {
                // Optional: Delete physical file if it's local
                if (file_exists($item['url']) && strpos($item['url'], 'uploads/') === 0) {
                    unlink($item['url']);
                }
            } else {
                $filteredMedia[] = $item;
            }
        }
        $data['media'] = $filteredMedia;
        file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'media' => $data['media']]);
        break;

    case 'reorder_media':
        $newOrder = json_decode($_POST['media'], true);
        if ($newOrder) {
            $data['media'] = $newOrder;
            file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['success' => true, 'message' => 'Reordered successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid data']);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}
?>