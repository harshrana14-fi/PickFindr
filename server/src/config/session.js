const session = require('express-session');
const MongoStore = require('connect-mongo');

function createSessionMiddleware({ mongoUri, sessionSecret, isProd }) {
	if (!sessionSecret) {
		throw new Error('SESSION_SECRET is required');
	}

	return session({
		secret: sessionSecret,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: !!isProd,
			httpOnly: true,
			sameSite: isProd ? 'lax' : 'lax',
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
		},
		store: MongoStore.create({
			mongoUrl: mongoUri,
			collectionName: 'sessions',
			touchAfter: 24 * 3600,
		}),
	});
}

module.exports = { createSessionMiddleware };


