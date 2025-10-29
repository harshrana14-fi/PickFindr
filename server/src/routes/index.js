const { Router } = require('express');
const authRoutes = require('./auth');
const searchRoutes = require('./search');

const router = Router();

router.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/', searchRoutes);

module.exports = router;


