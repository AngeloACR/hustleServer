const mongoose = require('mongoose');
const config = require('../../config/database');

// Card Schema
const CardSchema = mongoose.Schema({
	username: {
		type: String
	},
	cards: [{
		type: String
	}],
});

const Card = module.exports = mongoose.model('Card', CardSchema);

module.exports.getCardByUsername = function(username, callback){
	const query = {username: username};
	Card.findOne(query, callback);
};


module.exports.getCardByEmail = function(email, callback){
	const query = {email: email};
	Card.findOne(query, callback);
};


module.exports.addCard = function(newCard, callback){
    newCard.save(callback);
};

module.exports.deleteCard = function(cardToDelete, callback){
	const query = {username: cardToDelete.username}
	Card.findOneAndRemove(query, callback);
};

module.exports.updateCard = function(cardToUpdate, updateData, callback){
	const query = {username: cardToUpdate.username};
	Card.findOneAndUpdate(query, 
    { $set: { 
		"email": updateData.email,
		"cards": updateData.cards,
		"charges": updateData.charges,
		"sAddress": updateData.sAddress,
		"bAddress": updateData.bAddress
    }},
	callback);
};
