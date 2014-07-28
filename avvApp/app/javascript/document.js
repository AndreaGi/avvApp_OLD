// Userlist data array for filling in info box
var userListData = [];

$( document ).ready(function() {
    populateClientPicker();

    populateCategoryPicker();

    $('#btnInsertDoc').on('click', addDocument);
});


function populateClientPicker(){

    $.getJSON( '/document/clients', function( data ) {
        userListData = data.clients;

        $.each(userListData, function(){

            $('#clientPicker')
                .append($("<option></option>")
                    .attr("value",this._id)
                    .text(this.name));

        });

    });
    $('#clientPicker').select2({placeholder: "Cliente"});

}

function populateCategoryPicker(){

    $.getJSON( '/document/clients', function( data ) {
        userListData = data.categories;

        $.each(userListData, function(){

            if(this.name != "Completate") {
                $('#catPicker')
                    .append($("<option></option>")
                        .attr("value", this._id)
                        .text(this.name));
            }

        });

    });
    $('#catPicker').select2({placeholder: "Categoria"});

}

// Add New Document
function addDocument(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    if($('#addDocument #clientPicker').val() === '' ||
       $('#addDocument #docTitle').val() === ''||
       $('#addDocument #catPicker').val() === '' ) { errorCount++; }

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var document = {
            'categoryId': $('#addDocument select#catPicker').val(),
            'clientId': $('#addDocument select#clientPicker').val(),
            'title': $('#addDocument input#docTitle').val(),
            'body': $('#addDocument textarea#body').val()
        };

        // Use AJAX to post the new object
        $.ajax({
            type: 'PUT',
            data: document,
            url: '/document/newDocument' ,
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                location.href='home';
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Compila tutti i campi obbligatori (Cliente / Categoria)');
        return false;
    }
}