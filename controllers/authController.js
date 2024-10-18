const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/database');
const JWT_SECRET = process.env.JWT_SECRET;

// Function to generate access and refresh tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

// Register a new user
exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO Users (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Login user
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);
        if (user.rowCount === 0) return res.status(400).send('User not found');

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(400).send('Invalid credentials');

        const tokens = generateTokens(user.rows[0]);
        res.json(tokens);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Refresh token
exports.refreshToken = (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);
    try {
        const user = jwt.verify(token, JWT_SECRET);
        const tokens = generateTokens(user);
        res.json(tokens);
    } catch (err) {
        res.sendStatus(403);
    }
};

// Logout user
exports.logout = (req, res) => {
    req.logout();
    res.send('Logged out successfully');
};
