import userModel from "../models/userModel.js";

const addQuickTask = async (req, res) => {
  const { userId, task } = req.body;

  if (!userId || !task) {
    return res
      .status(400)
      .json({ success: false, message: "User ID and task are required" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.quicktask.push({ task, isdone: false });
    await user.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Quick task added successfully",
        quicktask: user.quicktask,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getallQuickTaskbyId = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, quicktask: user.quicktask });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteQuickTask = async (req, res) => {
  const { userId, taskId } = req.body;
  if (!userId || !taskId) {
    return res.status(400).json({ success: false, message: "User ID and Task ID are required" });

  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found"
      });
    
    }

    const taskIndex = user.quicktask.findIndex((task) => task._id == taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ success: false, message: "Task not found"
      });

    }

    user.quicktask.splice(taskIndex, 1);
    await user.save();
    return res.status(200).json({ success: true, message: "Task deleted successfully"
    });
  }
  catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

const renameQuickTask = async (req, res) => {
  const { userId, taskId, task } = req.body;
  if (!userId || !taskId || !task) {
    return res.status(400).json({ success: false, message: "User ID, Task ID and task are required" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const taskIndex = user.quicktask.findIndex((task) => task._id == taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    user.quicktask[taskIndex].task = task;
    await user.save();
    return res.status(200).json({ success: true, message: "Task renamed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

const isDoneQuickTask = async (req, res) => {
  const { userId, taskId } = req.body;
  if (!userId || !taskId) {
    return res.status(400).json({ success: false, message: "User ID and Task ID are required" });
  }

  try {
    const user =  await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found"
      });
    }

    const taskIndex = user.quicktask.findIndex((task) => task._id == taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ success: false, message: "Task not found"
      });
    
    }

    user.quicktask[taskIndex].isdone = !user.quicktask[taskIndex].isdone;

    await user.save();

    return res.status(200).json({ success: true, message: "Task status updated successfully"
    });
  }
  catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


export { addQuickTask, getallQuickTaskbyId, deleteQuickTask, renameQuickTask, isDoneQuickTask };

