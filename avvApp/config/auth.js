// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'googleAuth' : {
		'clientID' 		: '376320199894-8ktuilsshg408eumlstq2j6dlgo624na.apps.googleusercontent.com',
		'clientSecret' 	: '376320199894-8ktuilsshg408eumlstq2j6dlgo624na.apps.googleusercontent.com',
		'callbackURL' 	: 'http://localhost:8080/auth/google/callback'
	}

};