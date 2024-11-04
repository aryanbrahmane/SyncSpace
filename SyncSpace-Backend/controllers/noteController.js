// noteController.js
import userModel from "../models/userModel.js";

// Add or update note
const addNote = async (req, res) => {
  const { userId, content = "", folderName } = req.body;  // Set default empty string

  if (!userId || !folderName) {
    console.log("Missing required fields:", { userId, folderName });
    return res.status(400).json({ 
      success: false, 
      message: "User ID and folder name are required" 
    });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Create new note with explicit empty string for content
    const newNote = {
      content: content || "",  // Ensure content is never undefined
      folderName
    };
    
    user.notes.push(newNote);
    await user.save();
    
    const savedNote = user.notes[user.notes.length - 1];
    console.log("Note created successfully:", savedNote);

    return res.status(200).json({
      success: true,
      message: "Note added successfully",
      note: savedNote
    });

  } catch (error) {
    console.error("Error in addNote:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Server error while creating note"
    });
  }
};

// Get notes and folders by user
const getNotesByUser = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      notes: user.notes,
      folders: user.folders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  const { userId, noteId } = req.body;

  if (!userId || !noteId) {
    return res.status(400).json({
      success: false,
      message: "User ID and note ID are required"
    });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const noteIndex = user.notes.findIndex(note => note._id.toString() === noteId);
    if (noteIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    user.notes.splice(noteIndex, 1);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add folder
const addFolder = async (req, res) => {
  const { userId, folderName } = req.body;

  if (!userId || !folderName) {
    return res.status(400).json({
      success: false,
      message: "User ID and folder name are required"
    });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.folders.push(folderName);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Folder added successfully",
      folder: folderName
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add update note function
const updateNote = async (req, res) => {
  const { userId, noteId, content } = req.body;

  if (!userId || !noteId) {
    return res.status(400).json({
      success: false,
      message: "User ID and note ID are required"
    });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const note = user.notes.id(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    note.content = content;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note
    });
  } catch (error) {
    console.error("Error in updateNote:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while updating note"
    });
  }
};

// Add rename folder function
const renameFolder = async (req, res) => {
  const { userId, oldName, newName } = req.body;

  if (!userId || !oldName || !newName) {
    return res.status(400).json({
      success: false,
      message: "User ID, old folder name, and new folder name are required"
    });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update folder name in folders array
    const folderIndex = user.folders.indexOf(oldName);
    if (folderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Folder not found"
      });
    }
    user.folders[folderIndex] = newName;

    // Update folderName in all notes of this folder
    user.notes.forEach(note => {
      if (note.folderName === oldName) {
        note.folderName = newName;
      }
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Folder renamed successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add delete folder function
const deleteFolder = async (req, res) => {
  const { userId, folderName } = req.body;

  if (!userId || !folderName) {
    return res.status(400).json({
      success: false,
      message: "User ID and folder name are required"
    });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Remove folder from folders array
    const folderIndex = user.folders.indexOf(folderName);
    if (folderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Folder not found"
      });
    }
    user.folders.splice(folderIndex, 1);

    // Remove all notes in this folder
    user.notes = user.notes.filter(note => note.folderName !== folderName);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Folder and associated notes deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export { addNote, getNotesByUser, deleteNote, addFolder, updateNote, renameFolder, deleteFolder };