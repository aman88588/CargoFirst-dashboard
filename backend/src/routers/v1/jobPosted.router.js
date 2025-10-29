const express = require('express');
const { jobCreateController,jobUpdateController,jobDeleteController,jobListController } = require('../../controllers/jobCRUD.controller.js');
const { AuthMiddleware } = require('../../middlewares/auth.middleware');

const jobPostedRouter = express.Router();

jobPostedRouter.post('/create',AuthMiddleware, jobCreateController);
jobPostedRouter.put('/update/:id',AuthMiddleware, jobUpdateController);
jobPostedRouter.delete('/delete/:id',AuthMiddleware, jobDeleteController);
jobPostedRouter.get('/list',AuthMiddleware, jobListController);

module.exports = jobPostedRouter;