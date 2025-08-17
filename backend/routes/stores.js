const express = require('express');
const {
  addStore,
  updateStore,
  deleteStore,
  getStores,
  getDashboardStats,
  getOwnerDashboard,
  ownerAddStore,
  ownerUpdateStore,
  ownerDeleteStore,
  rateStore
} = require('../controllers/storeController');
const auth = require('../middleware/auth');

const router = express.Router();

// ADMIN ROUTES

router.post('/', auth(['admin']), addStore);
router.put('/:id', auth(['admin']), updateStore);
router.delete('/:id', auth(['admin']), deleteStore);
router.get('/stats', auth(['admin']), getDashboardStats);

// STORE OWNER ROUTES

router.get('/owner/dashboard', auth(['store_owner']), getOwnerDashboard);
router.post('/owner', auth(['store_owner']), ownerAddStore);
router.put('/owner/:id', auth(['store_owner']), ownerUpdateStore);
router.delete('/owner/:id', auth(['store_owner']), ownerDeleteStore);

// USER ROUTE

router.post('/:id/rate', auth(['user']), rateStore);

// PUBLIC 
router.get('/', getStores);

module.exports = router;
