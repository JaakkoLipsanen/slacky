const express = require('express');
const authentication = require('../authentication');

const apiRouter = new express.Router();
apiRouter.get('/user/:username', (req, res) => {
	req.app.get('db').findUser(req.params.username)
	.then(user => res.json({ user: user }))
	.catch(err => { console.error("api.get(user) error! " + err); res.status(401).send(); });
});

apiRouter.post('/connection', authentication.requireAuthenticated, (req, res) => {	

	req.app.get('db').getRooms()
	.then(rooms => {
		console.log(rooms);
		res.json({ user: req.user, rooms: rooms });
	})
	.catch(err => res.status(500).send(err));
});

const authRouter = require('./auth.js');
apiRouter.use('/auth', authRouter);

module.exports = apiRouter;