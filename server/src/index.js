require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const { connectToDatabase } = require('./config/db');
const { createSessionMiddleware } = require('./config/session');
const { configurePassport } = require('./config/passport');
const routes = require('./routes');

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

async function start() {
	await connectToDatabase(MONGO_URI);
	configurePassport();

	const app = express();
	app.set('trust proxy', 1);

	app.use(morgan('dev'));
	app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
	app.use(express.json());
	app.use(cookieParser());

	app.use(createSessionMiddleware({
		mongoUri: MONGO_URI,
		sessionSecret: SESSION_SECRET,
		isProd: process.env.NODE_ENV === 'production',
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	app.use('/api', routes);

	app.listen(PORT, () => {
		console.log(`Server listening on http://localhost:${PORT}`);
	});
}

start().catch((err) => {
	console.error('Fatal error starting server', err);
	process.exit(1);
});


