const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Get all users (Admin use)
router.get("/", auth, async (req, res) => {
  const users = await User.find().select("name email role");
  res.json(users);
});

module.exports = router;