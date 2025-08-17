const Store = require("../models/Store");
const Rating = require("../models/Rating");
const User = require("../models/User")

exports.getOwnerDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({ where: { ownerId: req.userId } });
    if (!store) return res.json({ store: null, ratings: [], avgRating: 0 });

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]], 
    });

    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, r) => a + r.rating, 0) / ratings.length
        : 0;

    res.json({
      store,
      ratings: ratings.map((r) => ({
        id: r.id,
        rating: r.rating,
        createdAt: r.createdAt,
        user: {
          id: r.User?.id,
          name: r.User?.name,
          email: r.User?.email,
        },
      })),
      avgRating: avgRating.toFixed(1),
    });
  } catch (err) {
    console.error("Owner dashboard error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};



exports.addStore = async (req, res) => {
  try {
    const existing = await Store.findOne({ owner: req.userId });
    if (existing) return res.status(400).json({ msg: "You already have a store" });

    const store = new Store({
      ...req.body,
      owner: req.userId,
    });
    await store.save();
    res.json(store);
  } catch (err) {
    res.status(500).json({ msg: "Error adding store" });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true }
    );
    if (!store) return res.status(404).json({ msg: "Store not found" });
    res.json(store);
  } catch (err) {
    res.status(500).json({ msg: "Error updating store" });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!store) return res.status(404).json({ msg: "Store not found" });
    res.json({ msg: "Store deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting store" });
  }
};
