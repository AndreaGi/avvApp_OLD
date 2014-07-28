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
        connectWith: ".sortable"
    }).disableSelection();
});