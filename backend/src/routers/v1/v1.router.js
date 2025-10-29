const express = require('express');
const jobPostedRouter = require('./jobPosted.router');
const userRouter = require("./user.router");

const v1Router = express.Router();

v1Router.use('/dashboard', jobPostedRouter);
v1Router.use('/auth', userRouter);

module.exports = v1Router;