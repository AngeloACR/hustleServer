const mongoose = require('mongoose');
const config = require('../../config/database');

// Shipping Schema
const ShippingSchema = mongoose.Schema({
	username: {
		type: String
	},
	shippingDetails: [{	
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

const Shipping = module.exports = mongoose.model('Shipping', ShippingSchema);

module.exports.getShippingByUsername = function(username, callback){
	const query = {username: username};
	Shipping.findOne(query, callback);
};


module.exports.getShippingByEmail = function(email, callback){
	const query = {email: email};
	Shipping.findOne(query, callback);
};


module.exports.addShipping = function(newShipping, callback){
    newShipping.save(callback);
};

module.exports.deleteShipping = function(shippingToDelete, callback){
	const query = {username: shippingToDelete.username}
	Shipping.findOneAndRemove(query, callback);
};

module.exports.updateShipping = function(shippingToUpdate, updateData, callback){
	const query = {username: shippingToUpdate.username};
	Shipping.findOneAndUpdate(query, 
    { $set: { 
		"email": updateData.email,
		"cards": updateData.cards,
		"charges": updateData.charges,
		"sAddress": updateData.sAddress,
		"bAddress": updateData.bAddress
    }},
	callback);
};
