const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");

const {
  createProject,
  getProjects,
  getProjectTaskSummary,
  getProjectsProgress
} = require("../controllers/projectController");

router.post("/", auth, role("Admin"), createProject);
router.get("/", auth, getProjects);
router.get("/progress", auth, role("Admin"), getProjectsProgress);
router.get("/:id/summary", auth, role("Admin"), getProjectTaskSummary);

module.exports = router;