const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

const app = express();

dotenv.config();

mongoose.connect(
	process.env.DB_CONNECT,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err) => {
		if (err) console.log(err);
		else console.log('Connected to DB');
	}
);

//Middlewares
app.use(express.json());

app.use('/api/user', authRoutes);
app.use('/api/posts', postRoutes);

app.listen(3000, () => console.log(`Server listening at 3000`));
