const passport = require('passport');
const LocalStrategy = require('passport-local');

const db = require('./../database');

// Configure passport.js
module.exports = {
	setup(app) {
	
		app.use(passport.initialize());
		app.use(passport.session());

		// use local authentication. could use facebook/github whatever auth as well
		passport.use(new LocalStrategy(async (username, password, done) => {
			try {
				const user = await db.User.findOne({ 
					where: { username: username }
				});

				if(!user) {
					console.error("Passport LocalStrategy. User not found:", username);
					return done (null, false, { message: `User ${username} doesnt exist` });
				}

				const passwordMatches = await user.passwordMatches(password);
				if(!passwordMatches) {
					console.error("Passport LocalStrategy. Wrong password supplied for user", username);
					return done (null, false, { message: `Password doesn't match for user ${username}` });
				}

				delete user.password_hash; // remove the password, since it's not required from now on
				return done(null, user);
			}
			catch(err) { return done(err); }

		}));

		// Serialize user to a cookie
		passport.serializeUser((user, done) => {
			done(null, user.username);
		});

		// Deserialize user from cookie
		passport.deserializeUser(async (username, done) => {
			try {
				const user = await db.User.findOne({ 
					where: { username: username },
					attributes: { exclude: ['password_hash'] }
				});

				return done(null, user);
			}
			catch(err) { console.error("Passport.deserializer error", err); done(err); };
		});
	},

	authenticate(req, res, next) {
		return passport.authenticate('local', (err, user, info) => {
			if (err) return next(err);
			if (!user) return res.status(401).json({ error: "User not found" });

			req.login(user, err => {
				if (err) { return next(err); }
				return res.json({ user: user });
			});
		})(req, res, next); 
	}
}