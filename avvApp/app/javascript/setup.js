// Userlist data array for filling in info box
var userListData = [];

$( document ).ready(function() {

    updateCategoryList();
    updateClientList();
    updateShowComplete();

    // Add Category button click
    $('#btnAddCat').on('click', addCategory);
    $('#btnAddClient').on('click', addClient);

    $('#categories').on('click',"i.delCategory" ,delCategory);
    $('#clients').on('click', "i.delClient", delClient);
    $('#showComplete').on('click', "i", toggleComplete);
});


// Functions ========================================================================

function updateCategoryList(){

    var categoryList = "";

    $.getJSON( '/setup/categories', function( data ) {
        userListData = data.categories;

        $.each(userListData, function(){
            categoryList += "<span class='label label-default' style='background-color: "+this.color+"'>";
            categoryList +=  this.name;
            if(this.name != "Completate") {
                categoryList += "<i class='fa fa-times delCategory' rel='" + this._id + "' userId='" + data._id + "'></i></span>";
            }else{
                categoryList += "</span>";
            }
        });

        $("#categories").html(categoryList);
    });
}


function updateClientList(){

    var clientList = "";

    $.getJSON( '/setup/clients', function( data ) {
        userListData = data.clients;

        $.each(userListData, function(){
            clientList += "<span class='label label-default clientLabel' rel='" + this._id + "' userId='" + data._id + "'>";
            clientList +=  this.name;
            clientList += "<i class='fa fa-times delClient' rel='" + this._id + "' userId='"+ data._id +"'></i></span>";
        });

        $("#clients").html(clientList);

    });
}

function updateShowComplete(){
    var value = "";

    $("#showComplete i").remove();

    $.getJSON( '/setup/clients', function( data ) {

        if(data.showComplete) {
            value += "<i userId='"+ data._id +"' class='fa fa-check-square-o'></i>";
        }else{
            value += "<i userId='"+ data._id +"' class='fa fa-square-o' style='padding-right:3px'></i>";
        }

        $("#showComplete").prepend(value);

    });

}


// Add Category
function addCategory(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addCategory input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var category = {
            'name': $('#addCategory input#catName').val(),
            'color': $('#addCategory input#catColor').val()
        };

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'PUT',
            data: category,
            url: '/setup/addCategory/' + $(this).attr('rel'),
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addCategory #catName').val('Nome');

                // Update the table
                updateCategoryList();
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Compila tutti campi obbligatori (Nome e colore)');
        return false;
    }
}

// Remove category
function delCategory(event){
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Sei sicuro di voler elimare questa categoria?');

    var userId = {
       id: $(this).attr('userId')
    };

    if(confirmation === true){
        $.ajax({
            type: 'DELETE',
            data: userId,
            url: 'setup/categories/delete/' + $(this).attr('rel')
        }).done(function(response){
            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
            // Update the categories
            updateCategoryList();
        });
    }else{
        return false;
    }
}

// Add Client
function addClient(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    if($('#addClient #clientName').val() === 'Nome') { errorCount++; }

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var client = {
            'name': $('#addClient input#clientName').val(),
            'vatNumber': $('#addClient input#vatNumber').val()
        };

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'PUT',
            data: client,
            url: '/setup/addClient/' + $(this).attr('rel'),
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addClient #clientName').val('Nome');
                $('#addClient #vatNumber').val('P. IVA');

                // Update the table
                updateClientList();
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Compila tutti i campi obbligatori (Nome)');
        return false;
    }
}

// Remove client
function delClient(event){
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Sei sicuro di voler elimare questo cliente?');

    var userId = {
        id: $(this).attr('userId')
    };

    if(confirmation === true){
        $.ajax({
            type: 'DELETE',
            data: userId,
            url: 'setup/clients/delete/' + $(this).attr('rel')
        }).done(function(response){
            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
            // Update the categories
            updateClientList();
        });
    }else{
        return false;
    }
}

// Toggle complete
function toggleComplete(event){
    event.preventDefault();

    var userId = {
        id: $(this).attr('userId')
    };

    $.ajax({
        type: 'PUT',
        data: userId,
        url: 'setup/toggleComplete'
    }).done(function(response){
        // Check for a successful (blank) response
        if (response.msg === '') {
        }
        else {
            alert('Error: ' + response.msg);
        }
        // Update the categories
        updateShowComplete();
    });

}


// MISC Functions

$("#catName").click( function(value){
    setToNull(this, "Nome");
});
$("#catName").focusout( function(value){
    setDefault(this, "Nome");
});
$("#clientName").click( function(value){
    setToNull(this, "Nome");
});
$("#clientName").focusout( function(value){
    setDefault(this, "Nome");
});
$("#vatNumber").click( function(value){
    setToNull(this, "P. IVA");
});
$("#vatNumber").focusout( function(value){
    setDefault(this, "P. IVA");
});

function setToNull(elem, textToReplace){
    if( elem.value == textToReplace){
        elem.value = "";
    }
}
function setDefault(elem, textToReplace){
    if( elem.value == ""){
        elem.value = textToReplace;
    }
}