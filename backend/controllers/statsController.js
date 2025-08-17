const { User, Store, Rating } = require("../models");

exports.getStats = async (req, res) => {
  try {
    const users = await User.count();
    const stores = await Store.count();
    const ratings = await Rating.count();

    res.json({ users, stores, ratings });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ msg: "Failed to fetch stats" });
  }
};
