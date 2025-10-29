const { Router } = require('express');
const passport = require('passport');

const router = Router();

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
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/' }),
	(req, res) => {
		res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:5173');
	}
);

// GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
	'/github/callback',
	passport.authenticate('github', { failureRedirect: '/' }),
	(req, res) => {
		res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:5173');
	}
);

// Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get(
	'/facebook/callback',
	passport.authenticate('facebook', { failureRedirect: '/' }),
	(req, res) => {
		res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:5173');
	}
);

module.exports = router;


