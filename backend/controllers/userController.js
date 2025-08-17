const { User, Store, Rating } = require("../models");
const bcrypt = require("bcryptjs");
const { fn, col } = require("sequelize");

// GET USERS (with avg rating if role is store_owner)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Store,
          as: "stores",
          attributes: ["id", "name", "address"],
          include: [{ model: Rating, attributes: [] }],
        },
      ],
      attributes: {
        include: [
          [fn("ROUND", fn("AVG", col("stores->Ratings.rating")), 1), "rating"],
        ],
      },
      group: ["User.id", "stores.id"],
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ADD USER
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role, address } = req.body;

    // validation
    if (!name || name.length < 20 || name.length > 60) {
      return res.status(400).json({ msg: "Name must be 20–60 characters" });
    }
    if (address && address.length > 400) {
      return res.status(400).json({ msg: "Address must be max 400 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passRegex.test(password)) {
      return res.status(400).json({
        msg: "Password must be 8–16 chars, include 1 uppercase & 1 special char",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({ msg: "User created successfully", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, address } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await user.update({
      name: name || user.name,
      email: email || user.email,
      address: address || user.address,
      password: password
        ? await bcrypt.hash(password, 10)
        : user.password,
      role: role || user.role,
    });

    res.json({ msg: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await user.destroy();
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
