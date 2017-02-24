const express = require('express');
const authentication = require('../authentication');

const apiRouter = new express.Router();
apiRouter.get('/user/:username', (req, res) => {
	const user = req.app.get('db').findUser(req.params.username);
	res.json({ user: user });
});

apiRouter.post('/connection', authentication.requireAuthenticated, (req, res) => {	
	res.json({ user: req.user, rooms: req.app.get('db').rooms });
});

const authRouter = require('./auth.js');
apiRouter.use('/auth', authRouter);

module.exports = apiRouter;