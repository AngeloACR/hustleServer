const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../../config/database')
//const ShoppingCart = require('../../shop/models/shoppingCart');
//const ShoppingCart = require('../models/shoppingCart');

// Create user
userRouter.post('/cUser', (req, res, next) => {
	const fName = req.body.fName;
	const lName = req.body.lName;	
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const role = req.body.role;

	let newUser = new User({
		fName: fName,
		lName: lName, 
		email: email,
		username: username,
		password: password,
		role: role
	});

	User.getUserByUsername(newUser.username, (err, user) => {
		if(err) throw err;
		if(user){
			return res.json({
				success: false, 
				msg:'Username already in use'
			});			
		}
	});

	User.getUserByEmail(newUser.email, (err, user) => {
		if(err) throw err;
		if(user){
			return res.json({
				success: false, 
				msg:'Email already in use'
			});			
		}
	});

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
});

// Delete user
userRouter.post('/dUser', passport.authenticate('jwt', {session:false}), (req, res, next) => {
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
	
	User.getUserByUsername(username, (err, user) => {
		if(err) throw err;
		if(!user){
			console.log("Returning error");
			return res.json({
				success: false, 
				msg:'User not found'
			});			
		}

		User.comparePassword(password, user.password, (err, isMatch) => {
			if(err) throw err;
			if(isMatch){
				const token = jwt.sign(user, config.secret, {
					expiresIn: 604800 //1 week
				});
			
				var roleToken = 'Working on it'

				return res.json({
					success: true,
					token: 'JWT '+token,
					roleToken: roleToken,
					user: {
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email,
						role: user.role
					}
				});
			} else{
				return res.json({
					success: false, 
					msg: 'Wrong password'
				});
			};
		});
	});
});

// Profile
userRouter.get('/gUser', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	return res.json({
		user: req.user
	});
});

module.exports = userRouter;