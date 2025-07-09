const db = require("../config/db");

// Add to wishlist
exports.addToWishlist = (req, res) => {
  const { userId, productId } = req.body;
  const checkQuery = "SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?";
  const insertQuery = "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)";

  db.query(checkQuery, [userId, productId], (err, results) => {
    if (err) {
      console.error("Check wishlist error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      return res.status(200).json({ message: "Already in wishlist" });
    }

    db.query(insertQuery, [userId, productId], (err2, result) => {
      if (err2) {
        console.error("Insert wishlist error:", err2);
        return res.status(500).json({ error: "Insert failed" });
      }

      res.status(201).json({ message: "Added to wishlist" });
    });
  });
};

// Get wishlist by user ID
// Get wishlist by user ID with product details
exports.getWishlistByUser = (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT w.product_id, p.name AS title, p.image_url AS image, p.price
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Fetch wishlist error:", err);
      return res.status(500).json({ error: "Failed to fetch wishlist" });
    }

    res.json(results);
  });
};

exports.removeFromWishlist = (req, res) => {
  const { userId, productId } = req.params;

  const query = "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?";

  db.query(query, [userId, productId], (err, result) => {
    if (err) {
      console.error("Error removing from wishlist:", err);
      return res.status(500).json({ error: "Failed to remove item from wishlist" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    res.status(200).json({ message: "Item removed from wishlist" });
  });
};