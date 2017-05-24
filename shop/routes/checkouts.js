const express = require('express');
const checkoutRouter = express.Router();
const Checkout = require('../models/checkout');
const passport = require('passport');


//Create Checkout
checkoutRouter.post('/cCheck', passport.authenticate('jwt', {session:false}), (req, res, next) => {

	const user = req.user;
	const email = req.body.email;
	const charges = req.body.charges;
	const sAddress = req.body.sAddress;
	const bAddress = req.body.bAddress;
	const cards = req.body.cards

	let newCheckout = new Checkout({
		username: username,
		email: email,
		charges: charges,
		sAddress: sAddress,
		bAddress: bAddress,
		cards: cards
	});

	Checkout.createCheckoute(newCheckout, (cErr,check) => {
		if(cErr) {
			return res.json({
				success: false, 
				msg: cErr
			});
		}
		console.log("Checkout created");
		return res.json({
			success: true, 
			msg: 'Checkout registered'
		});	
	});

});

//Get Checkout
checkoutRouter.get('/gCheck', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const user = req.user;

	Checkoute.getCheckoutByUsername(user.username, (cErr,check) => {
	if(err) throw err;
		if(!check){
			console.log("Returning error");
			return res.json({
				success: false, 
				msg:'Checkout not found'
			});			
		} else{
			return res.json({
				success: true, 
				checkout: check
			});				
		};
	});

});

//Update Checkout
checkoutRouter.post('/uCheck', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const user = req.user;
	const updateData = req.body.updateData

	let dataToUpdate = new Checkout({
		username: user.username,
		email: updateData.email,
		charges: updateData.Charges,
		cards: updateData.cards,
		bAddress: updateData.bAddress,
		sAddress: updateData.sAddress
	});

	Checkoute.getCheckoutByUsername(user.username, (err,check) => {
	if(err) throw err;
		if(!check){
			console.log("Returning error");
			return res.json({
				success: false, 
				msg:'Checkout not found'
			});			
		} else{
			Checkout.updateCheckout(check, dataToUpdate, (uErr,uCheck) => {
				return res.json({
					success: true, 
					msg: 'Checkout updated'
				});				
			});
		};
	});
});

//Delete Checkout
checkoutRouter.post('/dCheck', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const user = req.user;

	Checkoute.getCheckoutByUsername(user.username, (cErr,check) => {
	if(err) throw err;
		if(!check){
			return res.json({
				success: false, 
				msg:'Checkout not found'
			});			
		} else{
			Checkout.deleteCheckout(check, (cErr,dCheck) => {
				if(err) throw err;
				return res.json({
					success: true, 
					msg:'Checkout deleted'
				});			
			});	
		};
	});
});

module.exports = checkoutRouter;