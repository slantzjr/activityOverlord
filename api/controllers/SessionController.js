/**
 * SessionController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var bcrypt = require('bcrypt');


module.exports = {
    
  'new': function (req, res) {
  	res.view('session/new');
  },

  create: function (req, res, next) {
  	//Check for username and password on signin page, if none provided throw error.
  	if(!req.param('email') || !req.param('password')) {
  		var UsernamePasswordRequiredError = [{name: 'usernamePasswordRequired', message: 'You must enter a username and password.'}]

  		req.session.flash = {
  			err: UsernamePasswordRequiredError
  		}

  		res.redirect('/session/new');
  		return;
  	}

  	//Otherwise try to find an account with a corresponding email
  	User.findOneByEmail(req.param('email'), function foundUser (err, user) {
  		if (err) return next(err);

  		//If no user is found iwth corresponding email throw error
  		if(!user) {
  			var noAccountError = [{name: 'noAccount', message: 'The email address ' + req.param('email') + ' does not exist!'}]

  			req.session.flash = {
  				err: noAccountError
  			}
  			res.redirect('/session/new');
  			return;
  		}

  		//If an account is found then compare the passwords
  		bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
  			if (err) return next(err);

  			//In the case where the passwords do not match
  			if(!valid) {
  				var usernamePasswordMismatchError = [{name: 'usernamePasswordMismatch', message: 'Please enter a valid password.'}]

  				req.session.flash = {
  					err: usernamePasswordMismatchError
  				}
  				res.redirect('/session/new');
  				return;
  			}

  			//Otherwise log the user in
  			req.session.authenticated = true;
  			req.session.User = user;

  			//Then send to the profile page
  			res.redirect('/user/show/' + user.id);
  		});
  	});
  },

  destroy: function(req, res, next) {
  	res.session.destroy();
  	res.redirect('/session/new');
  },

  _config: {}

  
};
