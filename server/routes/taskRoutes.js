const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const ctrl = require("../controllers/taskController");

// Admin only
router.post("/", auth, role("Admin"), ctrl.createTask);

// Both roles
router.get("/", auth, ctrl.getTasks);

// Member updates task
router.put("/:id", auth, ctrl.updateTask);

module.exports = router;