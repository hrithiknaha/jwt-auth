const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(
	process.env.DB_CONNECT,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err) => {
		if (err) console.log(err);
		else console.log('Connected to DB');
	}
);

const app = express();
const authRoutes = require('./routes/auth');

app.use('/api/user', authRoutes);

app.listen(3000, () => console.log(`Server listening at 3000`));
