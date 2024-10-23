const express = require('express');
require('dotenv').config({ path: './creds.env' });
const passport = require('./passport');
const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
    secret: JWT_SECRET, 
    resave: false, 
    saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/inventory', inventoryRoutes);
app.get('/check', (req, res) => res.send('InStock backend is running!'));

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
