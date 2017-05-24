const express = require('express');
const paymentRouter = express.Router();
const stripe = require('stripe')(
  'sk_test_z03dC38DlV6eDKNCOCDMq7oJ'
);

//Create Charge
paymentRouter.post('/cCharge', (req, res, next) => {
	
	const amount = req.body.payment.amount;
	const currency = req.body.payment.currency;
	const source = req.body.payment.source;
	const description = req.body.payment.description;

	const uLogged = req.body.uLogged;

	stripe.charges.create({
		amount: amount,
		currency: currency,
		source: source,
		description: description
	}, function(err,charge){
		if(err){
			console.log("There was this error, dude: "+ err);
			return res.json({
				success: false, 
				msg: err
			});
		} else{
			console.log("This is your charge id, dude: "+ charge.id)
			return res.json({
				success: true, 
				chargeId: charge.id
			});
		};
	});
});

//Retrieve Charge
paymentRouter.post('/rCharge', (req, res, next) => {
	const chargeId = req.body.chargeId;
	
	stripe.charges.retrieve(
		chargeId,
		function(err,charge){
		if(err){
			return res.json({
				success: false, 
				msg:err
			});
		} else{
			return res.json({
				success: true, 
				chargeDescription: charge.description
			});
		};
	});
});
module.exports = paymentRouter;