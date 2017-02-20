const express = require('express');
const RateLimit = require('express-rate-limit');
const authentication = require('../authentication');

const authRouter = new express.Router();
authRouter.post('/validate-credentials', function(req, res) { // asks whether credientials are correct, but does not login

	const user = req.app.get('db').findUser(req.body.username);
	res.json({ 
		valid : Boolean(user) && user.password === req.body.password  
	});
});

authRouter.post('/register', authentication.register);
authRouter.post('/login', authentication.login);
authRouter.post('/logout', authentication.logout);

// limits the amount of requests by single IP
if(process.env.NODE_ENV === 'production') {
	authRouter.use(new RateLimit({
		windowMs: 5 * 60 * 1000, // 5 minutes
		max: 50, // 50 requests
		message: "Too many requests.. Try again later"
	}));
}

module.exports = authRouter;