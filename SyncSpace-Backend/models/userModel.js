// userModel.js
import mongoose from 'mongoose';

const quickTaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  isdone: { type: Boolean, default: false }
});

const noteSchema = new mongoose.Schema({
  content: { type: String, default: "", required: false },
  folderName: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  quicktask: { type: [quickTaskSchema], default: [] },
  notes: { type: [noteSchema], default: [] },
  folders: { type: [String], default: [] }
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("users", userSchema);

export default userModel;