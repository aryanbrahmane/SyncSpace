import { addNote, getNotesByUser, deleteNote, addFolder, updateNote, renameFolder, deleteFolder } from "../controllers/noteController.js";
import express from "express";

const noteRouter = express.Router();

noteRouter.post("/addNote", addNote);
noteRouter.post("/getNotesByUser", getNotesByUser);
noteRouter.post("/deleteNote", deleteNote);
noteRouter.post("/addFolder", addFolder);
noteRouter.post('/updateNote', updateNote);
noteRouter.post('/renameFolder', renameFolder);
noteRouter.post('/deleteFolder', deleteFolder);

export default noteRouter;