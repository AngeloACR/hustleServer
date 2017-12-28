const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const compression = require('compression');
const config = require('./config/database');
const cookieSess = require('cookie-session');
const helmet = require('helmet')
const RateLimit = require('express-rate-limit');
const app = express();

const users = require('./users/routes/users');

const products = require('./shop/routes/products');
const shoppingCarts = require('./shop/routes/shoppingCarts');
const payments = require('./shop/routes/payments');
const billings = require('./shop/routes/billings');
const shippings = require('./shop/routes/shippings');
const cards = require('./shop/routes/cards');
const charges = require('./shop/routes/charges');

// Ports to listen

const testPort= 3000;
const prodPort = process.env.PORT || 8080;

//const myPort = testPort;
const myPort = prodPort;

//Database stuff

//const myDB = config.testDB;
const myDB = config.prodDB;

	// Connect to Database
mongoose.connect(myDB);

	// On Connection
mongoose.connection.on('connected', () => {
	console.log('Connected to database '+ myDB);
});

	// On Error
mongoose.connection.on('error', (err) => {
	console.log('Database error'+ err);
});


// Middlewares initialization

// app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc) 
 
var limiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes 
  max: 50, // limit each IP to 100 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
});
 
//  apply to all requests 
app.use(limiter);

	//App compression
app.use(compression());

	// Cors Middleware
app.use(cors());


	// Body Parser Middleware
app.use(bodyParser.json());

	//Cookie session Middleware
app.use(cookieSess ({
	name: 'Hustle Session',
	secret: config.cSecret,
    maxAge: 7*24 * 60 * 60 * 1000 //A week
	}));

app.use(helmet());

	// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Set Static Folder

app.use(express.static(path.join(__dirname, 'public')));

//Adding routes

	//User stuff routes
app.use('/users', users);

	//Shop stuff routes
app.use('/products', products);
app.use('/shoppingCarts', shoppingCarts);
app.use('/billings', billings);
app.use('/cards', cards);
app.use('/charges', charges);
app.use('/shippings', shippings);
app.use('/payments', payments);

// Index Route

	//In case of error
app.get('/', (req, res) => {
	res.send('Invalid Endpoint');
});

	//Pointing to angular app
app.get('/*', (req,res) => {
	var fileToSend = path.join(__dirname, 'public/index.html') 
	res.sendFile(fileToSend);
});

// Start Server

app.listen(myPort, () => {
	console.log('Server started on port '+myPort);
});