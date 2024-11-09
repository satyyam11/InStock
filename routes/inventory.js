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
/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all inventory items
 *     description: Retrieve a list of all inventory items.
 *     responses:
 *       200:
 *         description: A list of inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateUser, getInventory);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search inventory items
 *     description: Search for inventory items by query.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *     responses:
 *       200:
 *         description: A list of search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/search', authenticateUser, searchItems); // Add search route

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new inventory item
 *     description: Add a new item to the inventory.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item created
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad Request
 */
router.post('/', authenticateUser, createItem);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update an inventory item
 *     description: Update the details of an existing inventory item.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The inventory item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
router.put('/:id', authenticateUser, updateItem);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     description: Remove an inventory item from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The inventory item ID
 *     responses:
 *       204:
 *         description: Item deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
router.delete('/:id', authenticateUser, deleteItem);

/**
 * @swagger
 * /import-csv:
 *   post:
 *     summary: Import inventory items from a CSV file
 *     description: Upload a CSV file to add multiple inventory items.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Items imported
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad Request
 */
router.post('/import-csv', authenticateUser, upload.single('file'), importCSV);

/**
 * @swagger
 * /export-csv:
 *   get:
 *     summary: Export inventory items to a CSV file
 *     description: Download a CSV file containing all inventory items.
 *     responses:
 *       200:
 *         description: File downloaded
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 */
router.get('/export-csv', authenticateUser, exportCSV);

module.exports = router;
