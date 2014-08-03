// Userlist data array for filling in info box
var userListData = [];

$(document).ready(function() {
    populateClientPicker();

    populateCategoryPicker();

    $('#btnInsertDoc').on('click', addDocument);
    $('#btnModifyDoc').on('click', modifyDocument);
    $('#isComplete').on('click', "i", toggleComplete);
});

// Toggle complete
function toggleComplete(event){
    event.preventDefault();

    var documentId = $(this).attr('docId');
    $.getJSON('/document/data/' + documentId , function(data){

        var dataToPass = {isComplete: !data.document.isComplete};

        $.ajax({
            type: 'PUT',
            data: dataToPass,
            url: '/document/setComplete/' + documentId
        }).done(function (response) {
            // Check for a successful (blank) response
            if (response.msg === '') {
                fillDocumentValues(documentId);
            }
            else {
                alert('Error: ' + response.msg);
            }
        });

    });

}

function fillDocumentValues(docId){
    $.getJSON('/document/data/' + docId, function(data){
        $("#clientPicker").select2("val", data.document.clientId);
        $("#catPicker").select2("val", data.document.categoryId);
        $("#documentId").val(data.document._id);
        $("#body").val(data.document.body);
        $("#docTitle").val(data.document.title);
        updateShowComplete(data.document);
    });
}

function updateShowComplete(document){
    var value = "";

    $("#isComplete i").remove();


    if(document.isComplete) {
        value += "<i class='fa fa-check-square-o' docId=" + document._id + "></i>";
    }else{
        value += "<i class='fa fa-square-o' style='padding-right:3px' docId=" + document._id + "></i>";
    }

    $("#isComplete").prepend(value);

}


function populateClientPicker(){

    $.getJSON( '/setup/clients', function( data ) {
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

    $.getJSON( '/setup/categories', function( data ) {
        userListData = data.categories;

        $.each(userListData, function(){

            $('#catPicker')
                .append($("<option></option>")
                    .attr("value", this._id)
                    .text(this.name));

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
            'body': $('#addDocument textarea#body').val(),
            'isComplete' : false
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

                location.href='../home';
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

function modifyDocument(event) {
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
            'body': $('#addDocument textarea#body').val(),
            '_id': $('#addDocument input#documentId').val()
        };

        // Use AJAX to post the new object
        $.ajax({
            type: 'PUT',
            data: document,
            url: '/document/modDocument' ,
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                location.href='../home';
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