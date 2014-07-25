// Userlist data array for filling in info box
var userListData = [];

$( document ).ready(function() {
    populateClientPicker();

    populateCategoryPicker();
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