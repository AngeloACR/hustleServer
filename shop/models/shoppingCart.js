const mongoose = require('mongoose');
const config = require('../../config/database');
// const product = require('./product')

// ShoppingCart Schema
//Chequea esta pagina http://www.jonahnisenson.com/tips-on-working-with-embedded-arrays-in-mongoosemongo/
const ShoppingCartSchema = mongoose.Schema({
	username: String,
	products: [{
		pName: String,
		pQty: Number,
		pPrice: Number
	}]
});

const ShoppingCart = module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);

module.exports.getCartById = function(id, callback){
	ShoppingCart.findById(id, callback);
};

module.exports.getCartByUsername = function(username, callback){
	const query = {username: username};
	ShoppingCart.findOne(query, callback);
};

module.exports.createCart = function(newCart, callback){
	newCart.save(callback);
};

module.exports.deleteCart = function(username, callback){
	const query = {username: username};
	ShoppingCart.findOneAndRemove(query, callback);
};

module.exports.updateCart = function(cart, callback){
	const query = {username: cart.username};
	ShoppingCart.findOneAndUpdate(query, 
    { $set: { 
    	"products":cart.products
    }},
	callback);
};