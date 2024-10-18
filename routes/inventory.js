const express = require('express');
const { getInventory, createItem, updateItem, deleteItem } = require('../controllers/inventoryController');
const authenticateUser = require('../config/authenticateUser');
const router = express.Router();

router.use(authenticateUser);
router.get('/', getInventory);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
