$( document ).ready(function() {
    $('ul li i.fa-chevron-right').on('click', openDocument);
});

function openDocument(event){
    event.preventDefault();

    var documentId = $(this).attr('rel');
    location.replace("document/" + documentId);
    return false;
}


$(function() {
    $( ".sortable" ).sortable({
        handle: ".fa-bars",
        connectWith: ".sortable",
        receive: updateCategory
    }).disableSelection();
});

function updateCategory(event, ui){
    event.preventDefault();

    var newCategoryId = { id: $(this).attr('rel')};
    var name = $(this).attr('id');
    var documentId = ui.item.attr('rel');
    var data = {isComplete : true };
    if( name == "completeCat"){
        $.ajax({
            type: 'PUT',
            data: data,
            url: 'document/setComplete/' + documentId
        }).done(function (response) {
            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
        });

    } else {
        $.ajax({
            type: 'PUT',
            data: newCategoryId,
            url: 'document/updateCategory/' + documentId
        }).done(function (response) {
            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
        });
    }

}