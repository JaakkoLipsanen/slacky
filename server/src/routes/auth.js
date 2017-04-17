const express = require('express');
const RateLimit = require('express-rate-limit');
const authentication = require('../authentication');
const authRouter = new express.Router();

const db = require('../database');

authRouter.post('/register', authentication.register);
authRouter.post('/login', authentication.login);
authRouter.post('/logout', authentication.logout);
authRouter.post('/user', authentication.getLoggedInUser);

// limits the amount of requests by single IP so that user cannot
// spam login/validate-credientials requests
if(process.env.NODE_ENV === 'production') {
	authRouter.use(['/login', '/register'], new RateLimit({
		windowMs: 5 * 60 * 1000, // 5 minutes
		max: 50, // 50 requests
		message: "Too many requests.. Try again later"
	}));
}

module.exports = authRouter;