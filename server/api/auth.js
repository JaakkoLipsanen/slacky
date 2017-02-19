const express = require('express');
const RateLimit = require('express-rate-limit');

const authRouter = new express.Router();
authRouter.get('/query', function(req, res) {
	const user = req.app.get('db').findUser(req.query.username);
	res.json({ 
		auth: { 
			correct: Boolean(user) && user.password === req.query.password 
		} 
	});
});

authRouter.get('/login', function(req, res) {
	const user = req.app.get('db').findUser(req.query.username);
	if(user && user.password === req.query.password) {
		// SUCCESS
	}

	// fail
});

// limits the amount of requests by single IP
authRouter.use(new RateLimit({
	windowMs: 10 * 60 * 1000, // 20 minutes
	delayAfter: 50, // 30 api calls at normal speed (!! the front-end login-form sends A LOT of them so 100 is needed :P !!),
	delayMs: 2000, // 2 seconds
	max: 150, // 150 requests, but everything after 50 is still delayed
	message: "Too many requests.. Try again later"
}));

module.exports = authRouter;