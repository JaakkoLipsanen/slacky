const express = require('express');
const path = require('path');
const rootRouter = new express.Router();

rootRouter.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname + '/../views/index.html'));
});

rootRouter.use('/api', require('./api.js'));
module.exports = rootRouter;