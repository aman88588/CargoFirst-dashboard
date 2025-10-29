const express = require('express');
const { userSignUpController, userSignInController, userProfileController } = require('../../controllers/user.controller');
const { AuthMiddleware } = require('../../middlewares/auth.middleware');

const userRouter = express.Router();

userRouter.post('/signup', userSignUpController);
userRouter.post('/signin', userSignInController);
userRouter.get('/profile', AuthMiddleware, userProfileController)


module.exports = userRouter;