const { Router } = require('express');
const passport = require('passport');

const router = Router();
const isGitHubEnabled = !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
const isGoogleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const isFacebookEnabled = !!(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET);

router.get('/me', (req, res) => {
	if (req.isAuthenticated && req.isAuthenticated()) {
		return res.json({ user: req.user });
	}
	return res.json({ user: null });
});

router.get('/logout', (req, res, next) => {
	req.logout(function (err) {
		if (err) return next(err);
		res.clearCookie('connect.sid');
		res.json({ ok: true });
	});
});

// Google
if (isGoogleEnabled) {
    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get(
        '/google/callback',
        passport.authenticate('google', { failureRedirect: '/' }),
        (req, res) => {
            res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:5173');
        }
    );
} else {
    router.get('/google', (_req, res) => res.status(503).json({ error: 'Google auth not configured' }));
    router.get('/google/callback', (_req, res) => res.status(503).json({ error: 'Google auth not configured' }));
}

// GitHub
if (isGitHubEnabled) {
    router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
    router.get(
        '/github/callback',
        passport.authenticate('github', { failureRedirect: '/' }),
        (req, res) => {
            res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:5173');
        }
    );
} else {
    router.get('/github', (_req, res) => res.status(503).json({ error: 'GitHub auth not configured' }));
    router.get('/github/callback', (_req, res) => res.status(503).json({ error: 'GitHub auth not configured' }));
}

// Facebook
if (isFacebookEnabled) {
    router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
    router.get(
        '/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/' }),
        (req, res) => {
            res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:5173');
        }
    );
} else {
    router.get('/facebook', (_req, res) => res.status(503).json({ error: 'Facebook auth not configured' }));
    router.get('/facebook/callback', (_req, res) => res.status(503).json({ error: 'Facebook auth not configured' }));
}

module.exports = router;


