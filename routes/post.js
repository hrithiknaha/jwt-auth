const router = require('express').Router();

const auth = require('./verifyTokens');

router.get('/', auth, (req, res) => {
	res.json({
		post: {
			title: 'My First Post',
			description: 'You should access without authorization',
		},
	});
});

module.exports = router;
