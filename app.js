const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const config = require('./config/database');

const app = express();

//const users = require('./routes/users');
const users = require('./users/routes/users');

//const products = require('./routes/products');
const products = require('./shop/routes/products');

//const shoppingCarts = require('./routes/shoppingCarts');
const shoppingCarts = require('./shop/routes/shoppingCarts');

//const payment = require('./routes/payment');
const payments = require('./shop/routes/payments');

const checkouts = require('./shop/routes/checkouts');

// Port Number
const testPort= 3000;
const prodPort = process.env.PORT || 8080;


// Connect to Database
mongoose.connect(config.prodDB);

// On Connection
mongoose.connection.on('connected', () => {
	console.log('Connected to database '+config.prodDB);
});

// On Error
mongoose.connection.on('error', (err) => {
	console.log('Database error'+ err);
});

// Cors Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

app.use('/products', products);
app.use('/shoppingCarts', shoppingCarts);
app.use('/payment', payments);
app.use('/checkout', checkouts);


// Index Route
app.get('/', (req, res) => {
	res.send('Invalid Endpoint');
});

app.get('/*', (req,res) => {
	var fileToSend = path.join(__dirname, 'public/index.html') 
	res.sendFile(fileToSend);
});

// Start Server
app.listen(prodPort, () => {
	console.log('Server started on port '+prodPort);
});