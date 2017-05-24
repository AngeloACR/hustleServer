const mongoose = require('mongoose');
const config = require('../../config/database');

// Checkout Schema
const CheckoutSchema = mongoose.Schema({
	username: {
		type: String
	},
	email: {
		type: String,
	},
	charges: [{	
		type: String
	}],
	cards: [{
		type: String
	}],
	sAddress: [{
		type: String
	}],
	bAddress: [{
		type: String
	}],

});

const Checkout = module.exports = mongoose.model('Checkout', CheckoutSchema);

module.exports.getCheckoutByUsername = function(username, callback){
	const query = {username: username};
	Checkout.findOne(query, callback);
};


module.exports.getCheckoutByEmail = function(email, callback){
	const query = {email: email};
	Checkout.findOne(query, callback);
};


module.exports.addCheckout = function(newCheckout, callback){
    newCheckout.save(callback);
};

module.exports.deleteCheckout = function(checkoutToDelete, callback){
	const query = {username: checkoutToDelete.username}
	Checkout.findOneAndRemove(query, callback);
};

module.exports.updateCheckout = function(checkoutToUpdate, updateData, callback){
	const query = {username: checkoutToUpdate.username};
	Checkout.findOneAndUpdate(query, 
    { $set: { 
		"email": updateData.email,
		"cards": updateData.cards,
		"charges": updateData.charges,
		"sAddress": updateData.sAddress,
		"bAddress": updateData.bAddress
    }},
	callback);
};
