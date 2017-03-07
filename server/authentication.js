const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// Configure passport.js
const configPassport = (app) => {
	
	app.use(passport.initialize());
	app.use(passport.session());

	// checks whether username and password are valid
	passport.use(new LocalStrategy(
		(username, password, done) => {
			app.get('db').findUser(username, true)
			.then(user => {
				if (!user || user.password !== password) {
					console.log("Auth: LocalStrategy: user not found or wrong password");
					return done(null, false, { message: 'Username and password combination is wrong' });
				}

				delete user.password; // remove the user.password, since it's not required from now on
				return done(null, user);
			})
			.catch(err => done(err));
		}
	));

	// Serialize user to a cookie
	passport.serializeUser((user, done) => {
		done(null, user.username);
	});

	// Deserialize user from cookie
	passport.deserializeUser((username, done) => {
		app.get('db').findUser(username)
		.then(user => done(null, user))
		.catch(err => { console.error("Passport.deserializer error: ", err); done(err); });
	});
};

module.exports = {
	setup(app) {
		app.use(session({
			secret: process.env.SESSION_SECRET || 'some_random_chars_sagkdjghskldsgjkdsg',
			resave: false,
			saveUninitialized: false
			// todo: store: PostgresStore or something, because atm it is in memory and that 
			// A: is not persistent and B: doesn't work in heroku
		}));

		configPassport(app);
	},

	// login and register could maybe possibly idontknow combined :P ?
	login(req, res, next) {
		if(req.user) {
			req.logout();
		}

		return passport.authenticate('local', (err, user, info) => {
			if (err) { return next(err); }

			if (!user) { 		
				console.log("Login failed: wrong credentials");
				return res.status(401).json({ error: "User not found" });
			}

			req.login(user, err => {
				if (err) { return next(err); }

				// TODO: req.remember doesnt exists, just a placeholder
				if(req.remember) {
					req.session.cookie.maxAge = 2 * 24 * 60 * 60 * 1000; // two days
				}
				else {
					req.session.cookie.expires = false;
				}

				console.log("Login succesful");
				return res.json({ user: user });
			});
		})(req, res, next); 
	},

	register(req, res, next) {
		const db = req.app.get('db');

		db.findUser(req.body.username)
		.then(user => {
			if(user) {
				// todo: should redirect to login function above?
				res.status(401).json({ error: "Username already taken"});
				return;
			}

			db.createUser(req.body.username, req.body.password)
			.then(createdUser => {
				if(!createdUser) {
					res.status(500).json({ error: "Error creating a new user" });
					return;
				}

				req.login(createdUser, err => {
					if (err) { return next(err); }		

					console.log("Registeration succesful");
					return res.json({ user: createdUser });
				});
			});
		})
		.catch(err => { console.error("Passport.register error: " + err); next(err); });
	},

	logout(req, res, next) {
		req.logout();
		res.status(200).send();
	},

	loggedInUser(req, res, next) {
		res.json({ user: req.user });
	},

	requireAuthenticated(req, res, next) {
		if (!req.user) {
			res.status(401).json( { type: 'auth', message: 'You must be logged in' });
			return;
		}

		return next();
	}
};