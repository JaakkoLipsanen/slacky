const express = require('express');

const apiRouter = new express.Router();
apiRouter.get('/user/:username', function(req, res) {
	const user = req.app.get('db').findUser(req.params.username);
	res.json({ user: { exists: Boolean(user) } });
});

const authRouter = require('./auth.js');
apiRouter.use('/auth', authRouter);

module.exports = apiRouter;