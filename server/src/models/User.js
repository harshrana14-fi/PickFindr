const { Schema, model } = require('mongoose');

const OAuthProfileSchema = new Schema(
	{
		provider: { type: String, required: true },
		providerId: { type: String, required: true, index: true },
		displayName: String,
		email: { type: String, index: true },
		photo: String,
	},
	{ _id: false }
);

const UserSchema = new Schema(
	{
		profiles: { type: [OAuthProfileSchema], default: [] },
		primaryEmail: { type: String, index: true },
		name: String,
		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

UserSchema.index({ 'profiles.provider': 1, 'profiles.providerId': 1 });

module.exports = model('User', UserSchema);


