<?php
// Read the JSON file
$jsonData = file_get_contents('../data/PLEX-Data-Large-Signs.json');

// Decode JSON data into PHP array
$data = json_decode($jsonData, true);

// Function to search for parts by name
function searchPartsByName($parts, $name) {
    $results = array();
    foreach ($parts as $part) {
        if (stripos($part['Name'], $name) !== false) { // Case-insensitive search
            $results[] = $part;
        }
    }
    return $results;
}

// Get search query from the form submission
$searchQuery = isset($_GET['name']) ? $_GET['name'] : '';

// Perform search
$foundParts = searchPartsByName($data, $searchQuery);

// Return search results as JSON
echo json_encode($foundParts);
?>
