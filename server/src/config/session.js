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
		name: 'picfindr.sid', // Custom session name
		cookie: {
			secure: !!isProd,
			httpOnly: true,
			sameSite: isProd ? 'lax' : 'lax',
			maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days - persistent login
		},
		store: MongoStore.create({
			mongoUrl: mongoUri,
			collectionName: 'sessions',
			ttl: 60 * 60 * 24 * 30, // 30 days in MongoDB
			touchAfter: 24 * 3600, // Only update session every 24 hours
			autoRemove: 'native', // Use MongoDB's native TTL
		}),
	});
}

module.exports = { createSessionMiddleware };


