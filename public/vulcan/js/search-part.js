function searchParts() {
    var name = $('#name').val();
    $.ajax({
        url: 'php/search_part.php',
        method: 'GET',
        data: { name: name },
        dataType: 'json',
        success: function(response) {
            $('#partResult').empty();
            if (response.length > 0) {
                $('#partResult').append('<h2>Search Results</h2>');
                response.forEach(function(part) {
                    var partDetails = '';
                    partDetails += '<strong>Part No:</strong> ' + part['Part No'] + '<br>';
                    partDetails += '<strong>Rev:</strong> ' + part['Rev'] + '<br>';
//                    partDetails += '<strong>Image:</strong> ' + part['Image'] + '<br>';
                    partDetails += '<strong>Name:</strong> ' + part['Name'] + '<br>';
                    partDetails += '<strong>Old Part No:</strong> ' + part['Old Part No'] + '<br>';
                   partDetails += '<strong>Part Type:</strong> ' + part['Part Type'] + '<br>';
                   partDetails += '<strong>Part Group:</strong> ' + part['Part Group'] + '<br>';
//                    partDetails += '<strong>Grade:</strong> ' + part['Grade'] + '<br>';
//                    partDetails += '<strong>Temper:</strong> ' + part['Temper'] + '<br>';
                    partDetails += '<strong>Part Status:</strong> ' + part['Part Status'] + '<br>';
                    partDetails += '<strong>Main Building:</strong> ' + part['Main Building'] + '<br>';
                    partDetails += '<strong>Part Source:</strong> ' + part['Part Source'] + '<br>';
                    partDetails += '<strong>Note:</strong> ' + part['Note'] + '<br>';
//                    partDetails += '<strong>Custom Data Stock:</strong> ' + part['Custom Data Stock'] + '<br>';
                    partDetails += '<hr>';
                    $('#partResult').append(partDetails);
                });
            } else {
                $('#partResult').append('<p>No parts found.</p>');
            }
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
            $('#partResult').html('<p>An error occurred while processing your request. Please try again later.</p>');
        }
    });
}