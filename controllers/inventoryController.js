const pool = require('../config/database');
const csv = require('csv-parser');
const fs = require('fs');
const { parse } = require('json2csv');

// Get Inventory Items
const getInventory = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query('SELECT * FROM inventory WHERE user_id = $1', [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching inventory', err);
        res.status(500).send('Server Error');
    }
};

// Create Inventory Item
const createItem = async (req, res) => {
    const { name, quantity, price, category } = req.body;
    const userId = req.user.id;
    try {
        const result = await pool.query(
            'INSERT INTO inventory (name, quantity, price, category, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, quantity, price, category, userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating item', err);
        res.status(500).send('Server Error');
    }
};

// Update Inventory Item by ID
const updateItem = async (req, res) => {
    const { id } = req.params;
    const { name, quantity, price, category } = req.body;
    const userId = req.user.id;
    try {
        const result = await pool.query(
            'UPDATE inventory SET name = $1, quantity = $2, price = $3, category = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
            [name, quantity, price, category, id, userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Item not found or does not belong to user');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating item', err);
        res.status(500).send('Server Error');
    }
};

// Delete Inventory Item by ID
const deleteItem = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const result = await pool.query(
            'DELETE FROM inventory WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Item not found or does not belong to user');
        }
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error('Error deleting item', err);
        res.status(500).send('Server Error');
    }
};

// Import inventory data from CSV file
const importCSV = (req, res) => {
    const userId = req.user.id;
    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                for (const row of results) {
                    // Check if required fields are present
                    if (!row.name || !row.quantity || !row.price) {
                        return res.status(400).send('CSV contains invalid data');
                    }
                    await pool.query(
                        'INSERT INTO inventory (name, quantity, price, user_id) VALUES ($1, $2, $3, $4)',
                        [row.name, row.quantity, row.price, userId]
                    );
                }
                res.status(201).send('CSV imported successfully');
            } catch (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }
        });
};

// Export inventory data to CSV file
const exportCSV = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inventory WHERE user_id = $1', [req.user.id]);
        const csv = parse(result.rows);
        res.header('Content-Type', 'text/csv');
        res.attachment('inventory.csv');
        res.send(csv);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

module.exports = { getInventory, createItem, updateItem, deleteItem, importCSV, exportCSV};