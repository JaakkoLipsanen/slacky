const passport = require('passport');
const LocalStrategy = require('passport-local');

const session = require('express-session');
const PostgresSessionStore = require('connect-pg-simple')(session);

const db = require('./database');

// Configure passport.js
const configPassport = (app) => {
	
	app.use(passport.initialize());
	app.use(passport.session());

	// use local authentication. could use facebook/github whatever auth as well
	passport.use(new LocalStrategy((username, password, done) => {

		// find user and make sure the password matches
		db.User.findOne({ 
			where: { username: username }
		})
		.then(user => {
			if(!user) {
				console.error("Passport LocalStrategy. User not found:", username);
				return done (null, false, { message: `User ${username} doesnt exist` });
			}

			if(user.password !== password) {
				console.error("Passport LocalStrategy. Wrong password supplied for user", username);
				return done (null, false, { message: `Password doesn't match for user ${username}` });
			}

			delete user.password; // remove the user.password, since it's not required from now on
			return done(null, user);
		})
		.catch(err => { console.error("Passport.LocalStrategy error", err); done(err); });
	}));

	// Serialize user to a cookie
	passport.serializeUser((user, done) => {
		done(null, user.username);
	});

	// Deserialize user from cookie
	passport.deserializeUser((username, done) => {
		db.User.findOne({ 
			where: { username: username },
			attributes: { exclude: ['password'] }
		})
		.then(user => done(null, user))
		.catch(err => { console.error("Passport.deserializer error", err); done(err); });
	});
};

module.exports = {
	setup(app) {
		app.use(session({
			secret: process.env.SESSION_SECRET || 'some_random_chars_sagkdjghskldsgjkdsg',
			resave: false,
			saveUninitialized: false,
			store: new PostgresSessionStore({
			//	pg: pg
				conString: process.env.DATABASE_URL // this is implicit, but let's keep it for reference
			}),
		}));

		configPassport(app);
	},

	// login and register could maybe possibly idontknow combined :P ?
	login(req, res, next) {
		if(req.user) { // if user is logged in
			req.logout();
		}

		return passport.authenticate('local', (err, user, info) => {
			if (err) { return next(err); }

			if (!user) { 		
				console.error("Login failed: wrong credentials");
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
		db.User.findOne({
			where: { username: req.body.username }
		 })
		.then(user => {
			if(user) {
				// todo: should redirect to login function above?
				res.status(401).json({ error: "Username already taken"});
				return;
			}

			db.User.create({ username: req.body.username, password: req.body.password })
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
			})
			.catch(err => { console.error("Passport.register error", err); next(err); });
		});
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