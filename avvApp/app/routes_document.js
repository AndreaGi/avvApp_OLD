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
        var documentId = req.param.id;
        var documentData = User.findById({'documents._id' : documentId });
        console.log( "DOCUMENTDATA:" + documentData);
        res.render('document.ejs',{
            user:req.user,
            document:documentData
        });;
    });

    app.get('/document/clients', isLoggedIn,  function (req, res) {
        res.json(req.user);
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

}



// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}