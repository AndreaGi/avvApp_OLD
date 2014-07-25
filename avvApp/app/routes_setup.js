// load the things we need
var mongoose = require('mongoose');
var db = mongoose.connection;
// load up the user model
var User       = require('../app/models/user');

module.exports = function(app, passport) {

    app.get('/setup/categories', isLoggedIn,  function (req, res) {
        res.json(req.user);
    });

    app.get('/setup/clients', isLoggedIn,  function (req, res) {
        res.json(req.user);
    });


    // POST Categories
    app.put('/setup/addCategory/:id', isLoggedIn, function (req, res) {
        var userId = req.params.id;
        User.findByIdAndUpdate(
            userId,
            {$push:{"categories": req.body
            }},
            function(err, result) {
                res.send(
                    (err === null) ? { msg: '' } : { msg: err }
                );
            }
        );
    });

    // DELETE Categories
    app.delete('/setup/categories/delete/:id', isLoggedIn, function (req, res) {
        var catId = req.params.id;
        var userId = req.body.id;
        console.log("ID" + userId );
        User.findByIdAndUpdate(
            userId,
            { $pull: { "categories" : { _id: catId } } },
            function(err, result) {
                res.send(
                    (err === null) ? { msg: '' } : { msg: err }
                );
            }
        );
    });

    // POST Client
    app.put('/setup/addClient/:id', isLoggedIn, function (req, res) {
        var userId = req.params.id;
        User.findByIdAndUpdate(
            userId,
            {$push:{"clients": req.body
            }},
            function(err, result) {
                res.send(
                    (err === null) ? { msg: '' } : { msg: err }
                );
            }
        );
    });

    // DELETE Client
    app.delete('/setup/clients/delete/:id', isLoggedIn, function (req, res) {
        var  clientId = req.params.id;
        var userId = req.body.id;
        console.log("ID" + userId );
        User.findByIdAndUpdate(
            userId,
            { $pull: { "clients" : { _id: clientId } } },
            function(err, result) {
                res.send(
                    (err === null) ? { msg: '' } : { msg: err }
                );
            }
        );
    });

    // PUT Update show complete
    app.put('/setup/toggleComplete', isLoggedIn, function (req, res) {
        var userId = req.body.id;
        User.findById(userId, function (err, user) {
            user.showComplete = !user.showComplete;
            user.save(function (err) {
                if (err) return console.log(err);
                res.send(
                    (err === null) ? { msg: '' } : { msg: err }
                );
            });
        } );
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
