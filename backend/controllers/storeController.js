const { User, Store, Rating, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const { Op, fn, col, ValidationError } = require('sequelize');

// ADMIN: CREATE STORE 
const addStore = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, address, ownerEmail } = req.body;

    if (!name || !ownerEmail) {
      await t.rollback();
      return res.status(400).json({ msg: "Name and ownerEmail are required" });
    }

    const cleanEmail = ownerEmail.trim().toLowerCase();

    const owner = await User.findOne({
      where: { email: cleanEmail, role: "store_owner" },
      transaction: t
    });

    if (!owner) {
      await t.rollback();
      return res.status(400).json({ msg: "No store_owner found with this email" });
    }

    const store = await Store.create(
      { name, address, ownerId: owner.id },
      { transaction: t }
    );

    await t.commit();
    res.json({ msg: "Store created", store });
  } catch (err) {
    await t.rollback();
    console.error("AddStore error:", err);

    if (err instanceof ValidationError) {
      return res.status(400).json({ msg: err.errors.map(e => e.message).join(', ') });
    }

    res.status(500).json({ msg: err.message });
  }
};


// ADMIN: UPDATE STORE 
const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address } = req.body;

    const store = await Store.findByPk(id);
    if (!store) return res.status(404).json({ msg: 'Store not found' });

    if (name) store.name = name;
    if (address) store.address = address;

    // Update owner (email + address)
    const owner = await User.findByPk(store.ownerId);
    if (owner) {
      if (email) owner.email = email;
      if (address) owner.address = address;
      await owner.save();
    }

    await store.save();
    res.json({ msg: 'Store updated', store });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// ADMIN: DELETE STORE 
const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ msg: 'Not found' });
    await store.destroy();
    res.json({ msg: 'Store deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// OWNER: CREATE STORE 
const ownerAddStore = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const exists = await Store.findOne({ where: { ownerId: req.userId }, transaction: t });
    if (exists) {
      await t.rollback();
      return res.status(400).json({ msg: 'You already have a store' });
    }

    const { name, address } = req.body;
    const store = await Store.create(
      { name, address, ownerId: req.userId },
      { transaction: t }
    );

    // sync with owner address
    const owner = await User.findByPk(req.userId, { transaction: t });
    if (owner && address) {
      owner.address = address;
      await owner.save({ transaction: t });
    }

    await t.commit();
    res.json({ msg: 'Store created', store });
  } catch (err) {
    await t.rollback();
    if (err instanceof ValidationError) {
      return res.status(400).json({ msg: err.errors.map(e => e.message).join(', ') });
    }
    res.status(500).json({ msg: err.message });
  }
};

// OWNER: UPDATE STORE
const ownerUpdateStore = async (req, res) => {
  try {
    const store = await Store.findOne({ where: { id: req.params.id, ownerId: req.userId } });
    if (!store) return res.status(404).json({ msg: 'Not found or not yours' });

    const { name, address } = req.body;
    if (name) store.name = name;
    if (address) store.address = address;

    await store.save();

    // update owner’s User.address
    const owner = await User.findByPk(req.userId);
    if (owner && address) {
      owner.address = address;
      await owner.save();
    }

    res.json({ msg: 'Store updated', store });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// OWNER: DELETE STORE 
const ownerDeleteStore = async (req, res) => {
  try {
    const store = await Store.findOne({ where: { id: req.params.id, ownerId: req.userId } });
    if (!store) return res.status(404).json({ msg: 'Not found or not yours' });

    await store.destroy();
    res.json({ msg: 'Store deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// OWNER DASHBOARD
const getOwnerDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({ where: { ownerId: req.userId } });
    if (!store) return res.status(404).json({ msg: 'Store not found' });

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, attributes: ['name'] }]
    });

    const avg = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[fn('ROUND', fn('AVG', col('rating')), 1), 'avgRating']]
    });

    res.json({
      store,
      ratings: ratings.map(r => ({ user: r.User?.name || 'Unknown', rating: r.rating })),
      avgRating: avg?.get('avgRating') || 0,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ADMIN DASHBOARD 
const getDashboardStats = async (_, res) => {
  try {
    res.json({
      users: await User.count(),
      stores: await Store.count(),
      ratings: await Rating.count(),
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// USER: RATE STORE 
const rateStore = async (req, res) => {
  try {
    const { rating } = req.body;
    const { id } = req.params;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be 1–5' });
    }

    const store = await Store.findByPk(id);
    if (!store) return res.status(404).json({ msg: 'Store not found' });

    // add or update rating
    let existing = await Rating.findOne({ where: { storeId: id, userId: req.userId } });
    if (existing) {
      await existing.update({ rating });
    } else {
      await Rating.create({ storeId: id, userId: req.userId, rating });
    }

    // recalcalculate average rating
    const allRatings = await Rating.findAll({ where: { storeId: id } });
    const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    await store.update({ rating: avgRating });

    res.json({ msg: 'Rating submitted', avgRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to submit rating' });
  }
};

// GET STORES
const getStores = async (req, res) => {
  try {
    const { name, address, search, sort = 'name', order = 'ASC' } = req.query;
    const where = {};

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    // search across name + address
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
      ];
    }

    const stores = await Store.findAll({
      where,
      order: [[sort, order]],
      include: [{ model: Rating, attributes: [] }],
      attributes: {
        include: [[fn('ROUND', fn('AVG', col('Ratings.rating')), 1), 'rating']],
      },
      group: ['Store.id'],
    });

    res.json(stores);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


module.exports = {
  addStore, updateStore, deleteStore, getDashboardStats,
  ownerAddStore, ownerUpdateStore, ownerDeleteStore, getOwnerDashboard,
  getStores, rateStore,
};
