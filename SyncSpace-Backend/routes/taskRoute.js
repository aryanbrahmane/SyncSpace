import express from 'express';
import { addQuickTask, getallQuickTaskbyId, deleteQuickTask, renameQuickTask,isDoneQuickTask } from '../controllers/taskController.js';

const taskRouter = express.Router();

taskRouter.post('/addQuickTask', addQuickTask);
taskRouter.post('/getallQuickTaskbyId', getallQuickTaskbyId);
taskRouter.post('/deleteQuickTask', deleteQuickTask);
taskRouter.post('/renameQuickTask', renameQuickTask);
taskRouter.post('/isDoneQuickTask', isDoneQuickTask);

export default taskRouter;