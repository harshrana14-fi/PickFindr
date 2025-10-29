const { Router } = require('express');
const axios = require('axios');
const { requireAuth } = require('../middleware/auth');
const Search = require('../models/Search');

const router = Router();

// POST /api/search { term }
router.post('/search', requireAuth, async (req, res) => {
	try {
		const { term } = req.body || {};
		if (!term || typeof term !== 'string') {
			return res.status(400).json({ error: 'Invalid term' });
		}

		await Search.create({ userId: req.user._id, term, timestamp: new Date() });

		const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
		if (!UNSPLASH_ACCESS_KEY) {
			return res.status(500).json({ error: 'Unsplash access key not configured' });
		}

		const response = await axios.get('https://api.unsplash.com/search/photos', {
			params: { query: term, per_page: 30 },
			headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
		});

		const results = (response.data.results || []).map((img) => ({
			id: img.id,
			alt: img.alt_description,
			src: img.urls && (img.urls.small || img.urls.thumb),
			full: img.urls && img.urls.full,
			thumb: img.urls && img.urls.thumb,
			width: img.width,
			height: img.height,
			user: img.user && { name: img.user.name, profile: img.user.links && img.user.links.html },
		}));

		return res.json({ term, count: results.length, results });
	} catch (err) {
		console.error('Search error', err);
		return res.status(500).json({ error: 'Search failed' });
	}
});

// GET /api/top-searches
router.get('/top-searches', async (_req, res) => {
	try {
		const top = await Search.aggregate([
			{ $group: { _id: '$term', count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $limit: 5 },
			{ $project: { term: '$_id', count: 1, _id: 0 } },
		]);
		return res.json({ top });
	} catch (err) {
		console.error('Top searches error', err);
		return res.status(500).json({ error: 'Failed to fetch top searches' });
	}
});

// GET /api/history
router.get('/history', requireAuth, async (req, res) => {
	try {
		const items = await Search.find({ userId: req.user._id })
			.sort({ timestamp: -1 })
			.limit(50)
			.lean();
		return res.json({ history: items });
	} catch (err) {
		console.error('History error', err);
		return res.status(500).json({ error: 'Failed to fetch history' });
	}
});

module.exports = router;


