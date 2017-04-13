const express = require('express');
const path = require('path');

const rootRouter = new express.Router();
rootRouter.use('/api', require('./api.js'));

module.exports = rootRouter;