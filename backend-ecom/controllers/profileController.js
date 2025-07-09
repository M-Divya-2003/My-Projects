const db = require('../config/db');

// Get profile by user ID
const getProfileByUserId = (req, res) => {
  const { userId } = req.params;
  const query = 'SELECT * FROM profile WHERE user_id = ? LIMIT 1';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching profile:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(results[0]);
  });
};

// Update profile
const updateProfile = (req, res) => {
  const { userId } = req.params;
  const { username, dob, phone_no, address, bio } = req.body;
  const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

  // First: check if profile exists
  const checkQuery = 'SELECT * FROM profile WHERE user_id = ?';
  db.query(checkQuery, [userId], (err, results) => {
    if (err) {
      console.error('Error checking profile:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      // Insert new profile if it doesn't exist
      const insertQuery = `
        INSERT INTO profile (user_id, username, dob, phone_no, address, bio, profile_image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertQuery,
        [userId, username, dob, phone_no, address, bio, profile_image],
        (insertErr) => {
          if (insertErr) {
            console.error('Error inserting profile:', insertErr);
            return res.status(500).json({ error: 'Failed to insert profile' });
          }
          return res.json({ message: 'Profile created successfully' });
        }
      );
    } else {
      // Update existing profile
      const updateQuery = `
        UPDATE profile
        SET username = ?, dob = ?, phone_no = ?, address = ?, bio = ?, 
            profile_image = COALESCE(?, profile_image)
        WHERE user_id = ?
      `;
      db.query(
        updateQuery,
        [username, dob, phone_no, address, bio, profile_image, userId],
        (updateErr) => {
          if (updateErr) {
            console.error('Error updating profile:', updateErr);
            return res.status(500).json({ error: 'Failed to update profile' });
          }
          return res.json({ message: 'Profile updated successfully' });
        }
      );
    }
  });
};

module.exports = {
  getProfileByUserId,
  updateProfile,
};
