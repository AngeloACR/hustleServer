const express = require('express');
const cartRouter = express.Router();
const passport = require('passport');
const ShoppingCart = require('../models/shoppingCart');

// Create Cart
cartRouter.post('/cCart', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const username = req.user.username;

	const products = req.body.cProducts;

	let newCart = new ShoppingCart({
		username: username,
		products: products
	});

	ShoppingCart.createCart(newCart, (cErr,cCart) => {
		if(cErr) {
			return res.json({
				success: false, 
				msg: cErr
			});
		} else{
			return res.json({
				success: true, 
				msg: 'Cart created'
			});
		}
	});

});

// Delete Cart
cartRouter.get('/dCart', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const username = req.user.username;
	ShoppingCart.getCartByUsername(username, (err, cartToDelete) => {
		if(!cart){
				return res.json({
				success: false,
				msg: 'No cart for user'
			});
		} else {
			ShoppingCart.deleteCart(cartToDelete, (dErr, dCart) =>{
				if(err) throw err;
				return res.json({
					success: true,
					msg: 'Cart deleted'
				});
			});
		}
	});
});

// Update Cart
cartRouter.post('/uCart', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const username = req.user.username;
	const products = req.body.cProducts;

	console.log(req);

	let userCart = new ShoppingCart({
		username: username,
		products: products
	});

	ShoppingCart.updateCart(userCart, (uErr,uCart) => {
		if(uErr) {
			return res.json({
				success: false, 
				msg: uErr
			});
		}else {
			return res.json({
				success: true, 
				msg:'Cart Updated'
			});
		}
	});
}); 

// Get Cart
cartRouter.get('/gCart', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	const username = req.user.username;
	
	ShoppingCart.getCartByUsername(username, (err, cart) => {
		if(err) throw err;
		if(!cart){
				return res.json({
				success: false,
				msg: 'No cart for user'
			});
		} else {
			return res.json({
				success: true,
				cart: cart
			});
		}
	});
});

module.exports = cartRouter;