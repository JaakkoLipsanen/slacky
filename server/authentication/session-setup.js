const session = require('express-session');
const PostgresSessionStore = require('connect-pg-simple')(session);

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
	}
}