const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  signup,
  login,
  updateUser,
  deleteUser,
  getUser,
} = require("../controllers/userController");

router.post("/signup", signup);
router.post("/login", login);
router.patch("/", auth, updateUser);
router.delete("/", auth, deleteUser);
router.get("/", auth, getUser);

module.exports = router;
