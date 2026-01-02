import { Task } from "../model/task.js";



/*
  creating task for user 
*/
const createTask = async (req, res) => {
  try {
    const { title, description, importance, start, end, color } = req.body;
    const belongsTo = req.params.userId;

    if (!belongsTo) {
      return res.status(400).json({ status: "bad", content: "Missing userId in params" });
    }

    const task = new Task({
      title,
      description,
      importance,
      start,
      end,
      color,
      belongsTo,
      status: "pending",
    });

    await task.save();

    return res.status(201).json({ status: "good", content: task });
  } catch (err) {
    console.error("Error in createTask:", err);
    return res.status(500).json({ status: "bad", content: err.message });
  }
};


/*
  returning specific task by id 
*/
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ status: "bad", content: "Task not found" });
    }

    return res.status(200).json({ status: "good", content: task });
  } catch (err) {
    console.error(" Error in getTask:", err);
    return res.status(500).json({ status: "bad", content: err.message });
  }
};


/*
  returning all user tasks
*/
const getTasks = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ status: "bad", content: "Missing userId" });
    }

    const tasks = await Task.find({ belongsTo: userId });

    return res.status(200).json({
      status: "good",
      content: tasks || [],
    });
  } catch (err) {
    console.error(" Error in getTasks:", err);
    return res.status(500).json({ status: "bad", content: err.message });
  }
};


/*
  updating users task
*/
const updateTask = async (req, res) => {
  try {
    const { taskId,userId } = req.params;

    const { title, description, importance, start, end, color, status } = req.body;

    const updated = await Task.findByIdAndUpdate(
      taskId,
      { title, description, importance, start, end, color, status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ status: "bad", content: "Task not found" });
    }

    return res.status(200).json({ status: "good", content: updated });
  } catch (err) {
    console.error(" Error in updateTask:", err);
    return res.status(500).json({ status: "bad", content: err.message });
  }
};


/*
  deleting user task
*/
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const deleted = await Task.findByIdAndDelete(taskId);

    if (!deleted) {
      return res.status(404).json({ status: "bad", content: "Task not found" });
    }

    return res.status(200).json({ status: "good", content: "Task deleted successfully" });
  } catch (err) {
    console.error(" Error in deleteTask:", err);
    return res.status(500).json({ status: "bad", content: err.message });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ status: "bad", content: "Missing status field" });
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ status: "bad", content: "Task not found" });
    }

    return res.status(200).json({ status: "good", content: updated });
  } catch (err) {
    console.error("Error in changeStatus:", err);
    return res.status(500).json({ status: "bad", content: err.message });
  }
};

export default {
  createTask,
  getTask,
  getTasks,
  updateTask,
  deleteTask,
  changeStatus,
};
