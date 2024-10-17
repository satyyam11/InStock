const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const pool = require('./database'); // Import the database connection

app.use(express.json());

// Test route to check if the server is running
app.get('/', (req, res) => {
    res.send('InStock backend is running!');
});

// Example route to fetch data from PostgreSQL
app.get('/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Inventory');
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
