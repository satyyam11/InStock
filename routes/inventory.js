const express = require('express');
const {
    getInventory,
    createItem,
    updateItem,
    deleteItem,
    importCSV,
    exportCSV,
    searchItems, 
} = require('../controllers/inventoryController');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const authenticateUser = require('../config/authenticateUser'); 

// Protect routes with authenticateUser middleware
router.get('/', authenticateUser, getInventory);
router.get('/search', authenticateUser, searchItems); // Add search route
router.post('/', authenticateUser, createItem);
router.put('/:id', authenticateUser, updateItem);
router.delete('/:id', authenticateUser, deleteItem);
router.post('/import-csv', authenticateUser, upload.single('file'), importCSV);
router.get('/export-csv', authenticateUser, exportCSV);

module.exports = router;
