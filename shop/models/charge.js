const mongoose = require('mongoose');
const config = require('../../config/database');

// Charge Schema
const ChargeSchema = mongoose.Schema({
	username: {
		type: String
	},
	chargesIds: [{	
		type: String
	}],

});

const Charge = module.exports = mongoose.model('Charge', ChargeSchema);

module.exports.getChargeByUsername = function(username, callback){
	const query = {username: username};
	Charge.findOne(query, callback);
};


module.exports.getChargeByEmail = function(email, callback){
	const query = {email: email};
	Charge.findOne(query, callback);
};


module.exports.addCharge = function(newCharge, callback){
    newCharge.save(callback);
};

module.exports.deleteCharge = function(chargeToDelete, callback){
	const query = {username: chargeToDelete.username}
	Charge.findOneAndRemove(query, callback);
};

module.exports.updateCharge = function(chargeToUpdate, updateData, callback){
	const query = {username: chargeToUpdate.username};
	Charge.findOneAndUpdate(query, 
    { $set: { 
		"email": updateData.email,
		"cards": updateData.cards,
		"charges": updateData.charges,
		"sAddress": updateData.sAddress,
		"bAddress": updateData.bAddress
    }},
	callback);
};
