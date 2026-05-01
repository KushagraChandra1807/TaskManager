const Project = require("../models/Project");
const Task = require("../models/Task");

exports.createProject = async (req, res) => {
  const project = await Project.create({
    ...req.body,
    createdBy: req.user.id
  });
  res.json(project);
};

exports.getProjects = async (req, res) => {
  const projects = await Project.find().populate("members");
  res.json(projects);
};

exports.getProjectTaskSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id).select("title");
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    const tasks = await Task.find({ project: id }).select("status dueDate");
    const now = new Date();

    const done = tasks.filter((task) => task.status === "Done").length;
    const remaining = tasks.filter((task) => task.status !== "Done").length;
    const due = tasks.filter(
      (task) => task.status !== "Done" && task.dueDate && new Date(task.dueDate) < now
    ).length;

    return res.json({
      projectId: id,
      projectTitle: project.title,
      total: tasks.length,
      remaining,
      done,
      due,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
};

exports.getProjectsProgress = async (req, res) => {
  try {
    const projects = await Project.find().select("_id");

    const progressAggregation = await Task.aggregate([
      {
        $group: {
          _id: "$project",
          total: { $sum: 1 },
          done: {
            $sum: {
              $cond: [{ $eq: ["$status", "Done"] }, 1, 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $ne: ["$status", "Done"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const progressMap = {};
    progressAggregation.forEach((item) => {
      const percentage = item.total > 0 ? Math.round((item.done / item.total) * 100) : 0;
      progressMap[item._id.toString()] = {
        total: item.total,
        done: item.done,
        pending: item.pending,
        percentage,
      };
    });

    projects.forEach((project) => {
      const id = project._id.toString();
      if (!progressMap[id]) {
        progressMap[id] = {
          total: 0,
          done: 0,
          pending: 0,
          percentage: 0,
        };
      }
    });

    return res.json(progressMap);
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
};