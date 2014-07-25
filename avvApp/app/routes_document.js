// load the things we need
var mongoose = require('mongoose');
var db = mongoose.connection;
// load up the user model
var User       = require('../app/models/user');

module.exports = function(app, passport) {

    app.get('/document', isLoggedIn,  function (req, res) {
        res.render('document.ejs',{
            user:req.user
        });;
    });

    app.get('/document/clients', isLoggedIn,  function (req, res) {
        res.json(req.user);
    });

}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}