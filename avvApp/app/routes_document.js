// load the things we need
var mongoose = require('mongoose');
var db = mongoose.connection;
// load up the user model
var User       = require('../app/models/user');

module.exports = function(app, passport) {

    app.get('/document', isLoggedIn,  function (req, res) {
        res.render('document.ejs',{
            user:req.user,
            document:null
        });;
    });

    // Get existing document
    app.get('/document/:id', isLoggedIn,  function (req, res) {
        var documentId = req.params.id;
        var userId = req.user;
        var documentData;
        var clientData;
        var categoryData;

        User.findOne({_id: userId, 'documents._id' :documentId}, {'documents.$': 1}, function( err, user){
            documentData = user.documents[0];

            // I execute the other queries once I had the document Data
            User.findOne({_id: userId, 'clients._id' :documentData.clientId}, {'clients.$': 1}, function( err, user){
                clientData = user.clients[0];

                User.findOne({_id: userId, 'categories._id' :documentData.categoryId}, {'categories.$': 1}, function( err, user){
                    categoryData = user.categories[0];

                    res.render('document.ejs',{
                        user:req.user,
                        document:documentData,
                        client:clientData,
                        category:categoryData
                    });
                });
            });
        });
    });

    // GET SINGLE DOCUMENT
    app.get('/document/data/:id', isLoggedIn,  function (req, res) {
        var documentId = req.params.id;
        var userId = req.user;
        var documentData;
        var clientData;
        var categoryData;

        User.findOne({_id: userId, 'documents._id' :documentId}, {'documents.$': 1}, function( err, user){
            documentData = user.documents[0];

            res.send({
                document:documentData
            });
        });
    });

    // POST Client
    app.put('/document/newDocument', isLoggedIn, function (req, res) {
        var user = req.user;
        var userId = user._id;
        User.findByIdAndUpdate(
            userId,
            {$push:{"documents": req.body
            }},
            function(err, result) {
                res.send(
                    (err === null) ? { msg: '' } : { msg: err }
                );
            }
        );
    });

    // PUT Document, update Category
    app.put('/document/updateCategory/:id', isLoggedIn, function(req, res){
       var documentId = req.params.id;
        var newCategory = req.body.id;
        console.log( "CAT " + newCategory);
        User.update({'documents._id' : documentId},
            {'$set' : {
                'documents.$.categoryId' : newCategory,
                'documents.$.isComplete' : false
            }},
        function(err){
            res.send(
                (err === null) ? { msg: '' } : { msg: err }
            );
        });

    });

    // PUT Document, set the document as complete
    app.put('/document/setComplete/:id', isLoggedIn, function(req, res){
        var documentId = req.params.id;
        User.update({'documents._id' : documentId},
            {'$set' : {
                'documents.$.isComplete' : req.body.isComplete
            }},
            function(err){
                res.send(
                    (err === null) ? { msg: '' } : { msg: err }
                );
            });
    });

    // PUT Document, update all Document
    app.put('/document/modDocument', isLoggedIn, function (req, res) {
        var document = req.body;
        User.update({'documents._id' : document._id},
            {'$set' : {
                'documents.$.categoryId' : document.categoryId,
                'documents.$.clientId' : document.clientId,
                'documents.$.body' : document.body,
                'documents.$.title' : document.title,
                'documents.$.modificationDate' : new Date()
            }},
            function(err, result) {
                res.send(
                    (err === null) ? { msg: '' } : { msg: err }
                );
            });
    });

}



// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}