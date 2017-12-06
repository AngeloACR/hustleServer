const express = require('express');
const checkoutRouter = express.Router();
const Card = require('../models/card');
const passport = require('passport');


//Create Card
checkoutRouter.post('/cCheck', passport.authenticate('jwt', {session:false}), (req, res, next) => {

	const user = req.user;
	const email = req.body.email;
	const charges = req.body.charges;
	const sAddress = req.body.sAddress;
	const bAddress = req.body.bAddress;
	const cards = req.body.cards

	let newCard = new Card({
		username: user.username,
		email: email,
		charges: charges,
		sAddress: sAddress,
		bAddress: bAddress,
		cards: cards
	});

	Card.createCheckoute(newcard, (cErr,check) => {
		if(cErr) {
			return res.json({
				success: false, 
				msg: cErr
			});
		}
		return res.json({
			success: true, 
			msg: 'Card registered'
		});	
	});

});

//Get Card
checkoutRouter.get('/gCheck', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const user = req.user;

	Checkoute.getCheckoutByUsername(user.username, (cErr,check) => {
	if(err) throw err;
		if(!check){
			console.log("Returning error");
			return res.json({
				success: false, 
				msg:'Card not found'
			});			
		} else{
			return res.json({
				success: true, 
				Card: check
			});				
		};
	});

});

//Update Card
checkoutRouter.post('/uCheck', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const user = req.user;
	const updateData = req.body.updateData

	let dataToUpdate = new Card({
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
				msg:'Card not found'
			});			
		} else{
			Card.updateCheckout(check, dataToUpdate, (uErr,uCheck) => {
				return res.json({
					success: true, 
					msg: 'Card updated'
				});				
			});
		};
	});
});

//Delete Card
checkoutRouter.post('/dCheck', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const user = req.user;

	Checkoute.getCheckoutByUsername(user.username, (cErr,check) => {
	if(err) throw err;
		if(!check){
			return res.json({
				success: false, 
				msg:'Card not found'
			});			
		} else{
			Card.deleteCheckout(check, (cErr,dCheck) => {
				if(err) throw err;
				return res.json({
					success: true, 
					msg:'Card deleted'
				});			
			});	
		};
	});
});

module.exports = checkoutRouter;