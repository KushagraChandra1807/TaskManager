const Task = require("../models/Task");
const Project = require("../models/Project");


// 👑 ADMIN: CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, assignedTo, project, dueDate } = req.body;

    if (!title || !assignedTo || !project) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const projectExists = await Project.findById(project).select("_id");
    if (!projectExists) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const task = await Task.create({
      title,
      assignedTo,
      project,
      dueDate: dueDate || undefined,
      createdBy: req.user._id,
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


// 👥 GET TASKS
exports.getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "Admin") {
      tasks = await Task.find()
        .populate("assignedTo", "name email")
        .populate("createdBy", "name")
        .populate("project", "title");
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate("assignedTo", "name email")
        .populate("createdBy", "name")
        .populate("project", "title");
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


// 👤 MEMBER: UPDATE TASK
// exports.updateTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);

//     if (!task) return res.status(404).json({ msg: "Task not found" });

//     // Only assigned member can update
//     if (task.assignedTo.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ msg: "Not your task" });
//     }

//     // Only status update allowed
//     task.status = "Done";

//     await task.save();

//     res.json(task);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not your task" });
    }

    // toggle logic
    task.status = task.status === "Done" ? "Pending" : "Done";

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};