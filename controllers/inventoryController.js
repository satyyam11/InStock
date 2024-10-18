const pool = require('../config/database');

// Get Inventory Items
const getInventory = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query('SELECT * FROM Inventory WHERE user_id = $1', [userId]);
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
            'INSERT INTO Inventory (name, quantity, price, category, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
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
            'UPDATE Inventory SET name = $1, quantity = $2, price = $3, category = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
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
            'DELETE FROM Inventory WHERE id = $1 AND user_id = $2 RETURNING *',
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

module.exports = { getInventory, createItem, updateItem, deleteItem };
