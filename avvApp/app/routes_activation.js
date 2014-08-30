// load the things we need
var mongoose = require('mongoose');
var validator = require('validator');
var db = mongoose.connection;
// load up the user model
var User       = require('../app/models/user');

module.exports = function(app, passport) {

    app.post('/accountActivation', function(req, res){
        var email = req.body.email;
        var code = req.body.key;
        if(validator.isEmail(email)){
            if( validator.isNull(code)){
                req.flash("errorMessage", "Inserisci la chiave");
                res.redirect("/accountActivation");
            }   else {
                User.findOne({ 'local.email': email }, function (err, user) {
                    if (err) {
                        req.flash("activationMessage", "error");
                        res.redirect("/accountActivation");
                    }

                    if(user.local.activationCode == code){
                        user.local.active = true;

                        user.save(function(err) {
                            if (err) {
                                req.flash("errorMessage", "C'è stato un'errore, riprova");
                                res.redirect("/accountActivation");
                            }
                            req.flash("infoLoginMessage", "Il tuo account è stato attivato, effettua il login");
                            res.redirect("/login");
                        });
                    }else{
                        req.flash("errorMessage", "Chiave errata");
                        res.redirect("/accountActivation");
                    }
                });
            }
        }else{
            req.flash("errorMessage", "Indirizzo email non valido");
            res.redirect("/accountActivation");
        }
    });

}