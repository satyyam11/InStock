const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./config/database'); // Ensure correct path

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  pool.query('SELECT * FROM Users WHERE id = $1', [id], (err, results) => {
    if (err) return done(err);
    done(null, results.rows[0]);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const result = await pool.query('SELECT * FROM Users WHERE google_id = $1', [profile.id]);
    if (result.rowCount > 0) return done(null, result.rows[0]);
    const newUser = await pool.query(
      'INSERT INTO Users (username, google_id) VALUES ($1, $2) RETURNING *',
      [profile.displayName, profile.id]
    );
    done(null, newUser.rows[0]);
  } catch (err) {
    done(err);
  }
}));

module.exports = passport;
