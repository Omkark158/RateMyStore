const express = require("express");
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth(["admin"]), getUsers);
router.post("/", auth(["admin"]), addUser);
router.put("/:id", auth(["admin"]), updateUser);
router.delete("/:id", auth(["admin"]), deleteUser);

module.exports = router;
