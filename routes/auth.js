const express = require('express');
const passport = require('passport');
const { login, register, refreshToken, logout, changePassword } = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with their details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Bad Request
 */
router.post('/register', register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user with their credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 *       401:
 *         description: Unauthorized
 */
router.post('/login', login);

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh the authentication token
 *     description: Get a new authentication token using the refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Unauthorized
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout the user
 *     description: Log out the authenticated user.
 *     responses:
 *       200:
 *         description: User logged out
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', logout);

/**
 * @swagger
 * /change-password:
 *   post:
 *     summary: Change user password
 *     description: Change the password for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad Request
 */
router.post('/change-password', changePassword); // Add change password route

/**
 * @swagger
 * /google:
 *   get:
 *     summary: Authenticate with Google
 *     description: Redirect the user to Google's OAuth 2.0 login page.
 *     responses:
 *       302:
 *         description: Redirect to Google login
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handle the callback from Google after user authentication.
 *     responses:
 *       302:
 *         description: Redirect to success or failure URL
 */
router.get('/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));

module.exports = router;
