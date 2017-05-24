const mongoose = require('mongoose');
const config = require('../../config/database');

// Product Schema
const ProductSchema = mongoose.Schema({
	pName: {
		type: String,
		required: true
	},
	pPrice: {
		type: String,
		required: true
	},
	pDescription: {
		type: String,
	},
	pStock: {
		type: String,
		required: true
	}
});

const Product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.getProductById = function(id, callback){
	Product.findById(id, callback);
};

module.exports.getProductByName = function(name, callback){
	const query = {pName: name};
	Product.findOne(query, callback);
};

module.exports.getAllProducts = function(callback){
	const query = {};
	Product.find(query, callback);
};

module.exports.createProduct = function(newProduct, callback){
	newProduct.save(callback);
};

module.exports.deleteProduct = function(productToDelete, callback){
	const query = {pName: productToDelete.pName}
	Product.findOneAndRemove(query, callback);	
};

module.exports.updateProduct = function(productToUpdate, updateData, callback){
	const query = {pName: productToUpdate.pName};
	Product.findOneAndUpdate(query, 
    { $set: { 
		"pName": updateData.pName,
    	"pPrice": updateData.pPrice,
    	"pStock": updateData.pStock,
    	"pDescription": updateData.pDescription
    }},
	callback);
};
