const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id).lean();
		done(null, user);
	} catch (err) {
		done(err);
	}
});

async function findOrCreateUser({ provider, profile }) {
	const providerId = String(profile.id);
	const email = profile.emails && profile.emails[0] ? profile.emails[0].value : undefined;
	const displayName = profile.displayName;
	const photo = profile.photos && profile.photos[0] ? profile.photos[0].value : undefined;

	let user = await User.findOne({ 'profiles.provider': provider, 'profiles.providerId': providerId });
	if (user) return user;

	user = await User.create({
		profiles: [
			{ provider, providerId, displayName, email, photo },
		],
		primaryEmail: email,
		name: displayName,
	});
	return user;
}

function configurePassport() {
	const {
		GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET,
		GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET,
		OAUTH_CALLBACK_BASE = 'http://localhost:4000',
	} = process.env;

    if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
		passport.use(
			new GoogleStrategy(
				{
					clientID: GOOGLE_CLIENT_ID,
					clientSecret: GOOGLE_CLIENT_SECRET,
					callbackURL: `${OAUTH_CALLBACK_BASE}/api/auth/google/callback`,
				},
				async (_accessToken, _refreshToken, profile, done) => {
					try {
						const user = await findOrCreateUser({ provider: 'google', profile });
						return done(null, user);
					} catch (err) {
						return done(err);
					}
				}
			)
		);
    } else {
        // Warn if Google is not configured so routes can handle gracefully
        console.warn('[auth] Google OAuth not configured (missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET)');
    }

    if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
		passport.use(
			new GitHubStrategy(
				{
					clientID: GITHUB_CLIENT_ID,
					clientSecret: GITHUB_CLIENT_SECRET,
					callbackURL: `${OAUTH_CALLBACK_BASE}/api/auth/github/callback`,
					scope: ['user:email'],
				},
				async (_accessToken, _refreshToken, profile, done) => {
					try {
						const user = await findOrCreateUser({ provider: 'github', profile });
						return done(null, user);
					} catch (err) {
						return done(err);
					}
				}
			)
		);
    } else {
        // Warn if GitHub is not configured so routes can handle gracefully
        console.warn('[auth] GitHub OAuth not configured (missing GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET)');
    }
}

module.exports = { configurePassport };


