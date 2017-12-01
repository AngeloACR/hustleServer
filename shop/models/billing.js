const mongoose = require('mongoose');
const config = require('../../config/database');

// Billing Schema
const BillingSchema = mongoose.Schema({
	username: {
		type: String
	},
	billingDetails: [{	
		fName: {
			type: String
		},
		lName: {
			type: String
		},
		email: {
			type: String,
		},
		phoneNumber: {
			type: String
		},
		address1: {
			type: String
		},
		address2: {
			type: String
		},
		country: {
			type: String
		},
		state: {
			type: String
		},
		city: {
			type: String
		},
		zipcode: {
			type: String
		}
	}]
});

const Billing = module.exports = mongoose.model('Billing', BillingSchema);

module.exports.getBillingByUsername = function(username, callback){
	const query = {username: username};
	Billing.findOne(query, callback);
};


module.exports.getBillingByEmail = function(email, callback){
	const query = {email: email};
	Billing.findOne(query, callback);
};


module.exports.addBilling = function(newBilling, callback){
    newBilling.save(callback);
};

module.exports.deleteBilling = function(billingToDelete, callback){
	const query = {username: billingToDelete.username}
	Billing.findOneAndRemove(query, callback);
};

module.exports.updateBilling = function(billingToUpdate, updateData, callback){
	const query = {username: billingToUpdate.username};
	Billing.findOneAndUpdate(query, 
    { $set: { 
		"email": updateData.email,
		"cards": updateData.cards,
		"charges": updateData.charges,
		"sAddress": updateData.sAddress,
		"bAddress": updateData.bAddress
    }},
	callback);
};
