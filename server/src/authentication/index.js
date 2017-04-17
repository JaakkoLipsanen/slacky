const db = require('./../database');
const passportHelper = require('./passport-helper');

module.exports = {
	setup(app) {
		require('./session-setup').setup(app);
		passportHelper.setup(app); // log in logic is in here
	},

	// login and register could maybe possibly idontknow combined :P ?
	login(req, res, next) {
		if(req.user) req.logout(); // log out if logged in
		return passportHelper.authenticate(req, res, next);
	},

	async register(req, res, next) {
		try {
			const userExists = await db.User.findOne({
				where: { username: req.body.username }
			});

			if(userExists) {
				// todo: should redirect to login function above?
				return res.status(401).json({
					success: false,
					error: {
						type: "username",
						message: "Username is already taken"
					}
				});
			}

			const createdUser = await db.User.createAndHashPassword({
				username: req.body.username,
				password: req.body.password
			});

			if(!createdUser) {
				return res.status(500).json({
					success: false,
					error: {
						type: "unknown",
						message: "Error creating a new user" }
					});
			}

			req.login(createdUser, err => {
				if (err) { return next(err); }

				console.log("Registeration succesful", "User:", req.body.username);
				return res.json({ success: true, payload: { user: createdUser } });
			});
		}
		catch(err) { console.error("Registeration error", err); next(err); };
	},

	logout(req, res, next) {
		req.logout();
		res.status(200).send();
	},

	getLoggedInUser(req, res, next) {
		res.json({ user: req.user });
	},

	requireAuthenticated(req, res, next) {
		if (!req.user) return res.status(401).json( { type: 'auth', message: 'You must be logged in' });
		return next();
	}
};