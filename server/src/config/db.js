const mongoose = require('mongoose');

async function connectToDatabase(mongoUri) {
	if (!mongoUri) {
		throw new Error('MONGO_URI is required to connect to MongoDB');
	}

	mongoose.set('strictQuery', true);
	await mongoose.connect(mongoUri, {
		// Use defaults suitable for modern drivers
	});

	return mongoose.connection;
}

module.exports = { connectToDatabase };


