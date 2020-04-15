const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
	//Validating data
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//Checking if user is already in the db
	await User.findOne({ email: req.body.email }, (err, user) => {
		if (user) return res.status(400).send('Email already exists');
	});

	//Hash the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	//Creating new user
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	});

	try {
		const savedUser = await user.save();
		res.send({ user: user._id });
	} catch (err) {
		res.status(400).send(err);
	}
});

router.post('/login', async (req, res) => {
	//Validating data
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//Checking Authentication
	await User.findOne({ email: req.body.email }, async (err, user) => {
		if (!user) return res.status(400).send('Email doesnt exist');
		const validPass = await bcrypt.compare(req.body.password, user.password);
		if (!validPass) return res.status(400).send('Invalid Password');

		//Create and assign token is login successful
		const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
		res.header('auth-token', token).send(token); //use res.cookies https://dev.to/mr_cea/remaining-stateless-jwt-cookies-in-node-js-3lle
	});
});

module.exports = router;
