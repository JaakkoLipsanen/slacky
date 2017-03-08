const express = require('express');
const authentication = require('../authentication');
const apiRouter = new express.Router();

const db = require('../database');

apiRouter.get('/user/:username', (req, res) => {
	db.User.findOne({
		where: { username: req.params.username },
		attributes: { exclude: ['password'] }
	})
	.then(user => res.json({ user: user }))
	.catch(err => { console.error("api.get(user) error!", err); res.status(401).send(); });
});

apiRouter.post('/connection', authentication.requireAuthenticated, (req, res) => {	
	db.Room.findAll({ 
		include: [{ 
			model: db.Message, // include messages
			include: [{ 
				model: db.User, as: 'sender' // include sender to all messages
			}] 
		}],
		order: [[db.Message, 'timestamp']] // order ascending by time 
	})
	.then(rooms => res.json({ user: req.user, rooms: rooms }) )
	.catch(err => { console.error("Error on establishing connection", err); res.status(500).send(err); });
});

const authRouter = require('./auth.js');
apiRouter.use('/auth', authRouter);

module.exports = apiRouter;