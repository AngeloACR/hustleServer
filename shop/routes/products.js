const express = require('express');
const productRouter = express.Router();
const Product = require('../models/product');
const passport = require('passport');


// Create product
productRouter.post('/cProduct', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const product = req.body.product;

	let newProduct = new Product({
		pName: product.pName,
		pPrice: product.pPrice,
		pStock: product.pStock,
		pDescription: product.pDescription
	});

	Product.createProduct(newProduct, (err,product) => {
		if(err) {
			return res.json({
				success: false, 
				msg: err
			});
		}else {
			return res.json({
				success: true, 
				msg:'Product Created'
			});
		}
	});
});

// Update product name
productRouter.post('/uProduct', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	
	const updateData = req.body.updateData;
	
	Product.getProductByName(updateData.pName, (err, productToUpdate) => {
		if (err) throw err;
		Product.updateProduct(productToUpdate, updateData, (uErr,uProduct) => {
			if(uErr) {
				return res.json({
					success: false, 
					msg: uErr
				});
			}else {
				return res.json({
					success: true, 
					msg:'Product Updated'
				});
			}
		});
	});
});

// Delete product
productRouter.post('/dProduct', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	
	const productToDelete = req.body.productToDelete;
	
	Product.getProductByName(productToDelete.pName, (err, productToDelete) => {
		if (err) throw err;
		Product.deleteProduct(productToDelete, (dErr,dProduct) => {
			if(dErr) {
				return res.json({
					success: false, 
					msg: dErr
				});
			}else {
				return res.json({
					success: true, 
					msg:'Product Deleted'
				});
			}
		});
	});
});


// Get product
productRouter.get('/gProducts', (req, res, next) => {
	
	Product.getAllProducts( (err, products) => {
		if (err) throw err;
		var pMap = [{}];
		var i = 0;
		products.forEach(function(product) {
			pMap[i] = product;
			i++;
		});
		return res.json({
			products: pMap
		});
	});
});

module.exports = productRouter;