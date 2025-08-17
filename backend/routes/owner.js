const express = require('express');
const {
  getOwnerDashboard,
  ownerAddStore,
  ownerUpdateStore,
  ownerDeleteStore
} = require('../controllers/storeController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', auth(['store_owner']), getOwnerDashboard);
router.post('/', auth(['store_owner']), ownerAddStore);
router.put('/:id', auth(['store_owner']), ownerUpdateStore);
router.delete('/:id', auth(['store_owner']), ownerDeleteStore);

module.exports = router;
