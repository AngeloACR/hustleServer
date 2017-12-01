const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const async = require('async')
const nodemailer = require('nodemailer');
const User = require('../models/user');
const config = require('../../config/database');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: config.contactMail, 
            pass: config.contactPass  
        }
    });

// Create user
/*userRouter.post('/cUser', (req, res, next) => {
	const fName = req.body.fName;
	const lName = req.body.lName;	
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const role = "HustleMan"

	let newUser = new User({
		fName: fName,
		lName: lName, 
		email: email,
		validEmail: false,
		username: username.toLowerCase(),
		password: password,
		role: role,
		hasCart: false,
		hasCheck: false
	});

	User.getUserByUsername(newUser.username, (err, fTry) => {
		if(err) throw err;
		if(!fTry){					
			User.getUserByEmail(newUser.email, (err, sTry) => {
				if(err) throw err;
				if(!sTry){
						User.addUser(newUser, (err, user) => {
							if(err){
								return res.json({
									success: false, 
									msg:'Failed to register user'
								});
							} else {	
								return res.json({
									success: true, 
									msg:'User registered'
								});
							}	
						});
				} else{
					return res.json({
						success: false, 
						msg:'Email already in use'
					});
				}
			});
		} else {
			return res.json({
				success: false, 
				msg:'Username already in use'
			});
		}
	});

});*/

userRouter.post('/cUser', (req, res, next) => {
	const fName = req.body.fName;
	const lName = req.body.lName;	
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const role = "HustleMan"

	let newUser = new User({
		fName: fName,
		lName: lName, 
		email: email,
		validEmail: false,
		username: username.toLowerCase(),
		password: password,
		role: role,
		hasCart: false,
		hasCheck: false
	});

	var getUser = function(callback) {
		User.getUserByUsername(newUser.username, (err, fTry) => {
			if(err) callback(err);
			if(!fTry){					
				callback(null, fTry);
			} else {
				callback(new Error('Username already in use'))
			}
		});
	} 
	
	var getMail = function(callback) {
		User.getUserByEmail(newUser.email, (err, sTry) => {
			if(err) callback(err);
			if(!sTry){
				callback(null, sTry);
			} else{
				callback(new Error('Email already in use'))			}
		});
	}

	var addUser = function(callback) {
		User.addUser(newUser, (err, user) => {
			if(err){
				callback(new Error('Failed to create user'))
			} else {
				callback(null, user);	
			}	
		});
	}

		async.waterfall([
    	getUser,
    	getMail,
    	addUser,
	], function (err, result) {
		if (err) {
			return res.json({
					success: false, 				
					msg: err.message			
				});
		}
		return res.json({
			success: true, 				
			msg: result			
		});    	
    });
});

// Create token
/*userRouter.post('/cToken', (req, res, next) => {
	const username = req.body.username;
	var vCombo = [];
	var user;

	User.getUserByUsername(username, (err, user) => {
		if(err) throw err;
		if(user){

			vCombo = User.genToken(user.username);

			User.setToken(user.username, vCombo[0], vCombo[1], (err, uToken) => {
				if(err) throw err;
				if(uToken){
					vCombo[0] = uToken.validToken;
					vCombo[1] = uToken.validTime;
					console.log(uToken);
					// setup e-mail data with unicode symbols
					var mailOptions = {
					    from: '"Contacto Hustle" <contacto@thehustleclub.org>', // sender address
					    to: uToken.email, // list of receivers
					    subject: 'Hustle validation', // Subject line
					    text: 'Hello! come on and enjoy the hustle benefits!', // plaintext body
					    html: '<b>'+vCombo[0]+'</b>' // html body
					};

					// send mail with defined transport object
					transporter.sendMail(mailOptions, function(error, info){
					    if(error){
					        return console.log(error);
					    }
					    console.log('Message sent: ' + info.response);
						return res.json({
							success: true, 				
							msg:'Token Created'
						});
					});
				}			
			}); 
		} else {
			return res.json({
				success: false, 				
				msg:'User not found'			
			});
		}
	});
});*/

userRouter.post('/cToken', (req, res, next) => {
	const username = req.body.username;

	var getUser = function(callback) {
		User.getUserByUsername(username, (err, user) => {
			if(err) callback(err);
			if(user){
				xUser = user;
				callback(null, xUser);
			} else {
				callback( new Error('User not found') )
				return;
			}
		});
	}

	var setToken = function(vUser, callback){
		vCombo = User.genToken(vUser.username);
		User.setToken(vUser.username, vCombo[0], vCombo[1], (err, uToken) => {
			if(err) callback(err);
			if(uToken){
				callback(null, uToken);
			} else {
				callback( new Error('Problems updating') )
			}			
		});
	} 

	var sendMail = function(uToken, callback){
		if(uToken.stack){
			callback(uToken);
		}
		var mailOptions = {
		    from: '"Contacto Hustle" <contacto@thehustleclub.org>', // sender address
		    to: uToken.email, // list of receivers
		    subject: 'Hustle validation', // Subject line
		    text: 'Hello! come on and enjoy the hustle benefits!', // plaintext body
		    html: '<b>'+vCombo[0]+'</b>' // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        callback(error);
		    }
		    console.log('Message sent: ' + info.response);
			callback(null, info.response);
		});
	}

	async.waterfall([
    	getUser,
    	setToken,
    	sendMail,
	], function (err, result) {
		if (err) {
			return res.json({
					success: false, 				
					msg: err.message			
				});
		}
		return res.json({
			success: true, 				
			msg: result			
		});    	
    });
});



// Validate user
userRouter.post('/vUser', (req, res, next) => {
	const username = req.body.username;
	const vToken = req.body.vToken;

	const hrTime = process.hrtime();
	const thisTime = hrTime[0] * 1000000 + hrTime[1] / 1000
	const maxTime = 3600*8*1000000; //8 horas

	User.getUserByUsername(username, (err, user) => {
		if(err) throw err;
		if(user){
			if(thisTime - user.validTime < maxTime) {
				if(user.validToken == vToken){
					User.validateUser(username, (err, vUser) =>{
						if(err) throw err;
						if(vUser) {
							return res.json({
								success: true, 				
								msg:'User validated'
							});
						}
					}); 
				} else{
					return res.json({
						success: false, 
						msg:'Wrong token'
					});	
				}			
			} else {
				return res.json({
					success: false, 
					msg:'Token has expired'
				});				
			} 
		} else {
			return res.json({
				success: false, 
				msg:'User not found'
			});
		}
	});
});


// Delete user
userRouter.get('/dUser', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const user = req.user;

	let userToDelete = new User({
		username: user.username
	});

	User.getUserByUsername(userToDelete.username, (err, user) => {
		if(err) throw err;
		if(!user){
			return res.json({
				success: false, 
				msg:'User not found'
			});			
		} else {
			User.deleteUser(user, (err, user) =>{
				if(err) throw err;
			
				return res.json({
					success: true, 
					msg:'User deleted'
				});			
			});
		}
	});
});

// Update user
userRouter.post('/uUser', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const user = req.user;
	const updateData = req.body.updateData;

	let dataToUpdate = new User({
		username: user.username,
		fName: updateData.fName,
		lName: updateData.lName,		
		email: updateData.email
	});

	User.getUserByUsername(updateData.username, (err, userToUpdate) => {
		if(err) throw err;
		if(!user){
			console.log("Returning error");
			return res.json({success: false, msg:'User not found'});			
		} else {
			User.updateUser(userToUpdate, dataToUpdate, (err, user) =>{

			});
		}
	});
});

// Authenticate
userRouter.post('/authUser', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	//var sess = req.session;
	
	User.getUserByUsername(username, (err, user) => {
		if(err) throw err;
		if(!user){
			return res.json({
				success: false, 
				msg: 'Login failed, invalid username or password'			
			});			
		}

		User.comparePassword(password, user.password, (err, isMatch) => {
			if(err) throw err;
			if(isMatch){
				const token = jwt.sign(user, config.secret, {
					expiresIn: 604800 //1 week
				});
				sess.username = username;
				sess.isLogged = true;
				sess.jwToken = "JWT " + token;
				return res.json({
					success: true,
					token: 'JWT '+token,
					user: {
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}
				});
			} else{
				return res.json({
					success: false, 
					msg: 'Login failed, invalid username or password'
				});
			};
		});
	});
});

// Get User
userRouter.get('/gUser', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	console.log(req.user);
	return res.json({
		user: req.user
	});
});

module.exports = userRouter;