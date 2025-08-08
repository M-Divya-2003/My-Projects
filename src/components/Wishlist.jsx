import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://13.51.235.169:5000/api/wishlist/${userId}`);
        setWishlist(res.data);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
      }
    };

    fetchWishlist();
  }, [userId]);

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://13.51.235.169:5000/api/wishlist/${userId}/${productId}`);
      setWishlist((prev) => prev.filter((item) => item.product_id !== productId));
    } catch (err) {
      console.error('Error removing item from wishlist:', err);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">💖 My Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="alert alert-info text-center">Your wishlist is empty.</div>
      ) : (
        <div className="row justify-content-center g-4">
          {wishlist.map((item) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center"
              key={item.product_id}
            >
              <div className="card h-100 shadow-sm border-0 rounded-4" style={{ width: '100%', maxWidth: '18rem' }}>
                <div
                  className="bg-white d-flex align-items-center justify-content-center rounded-top-4"
                  style={{ height: '230px', padding: '10px' }}
                >
                  <Link to={`/products/${item.product_id}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="img-fluid"
                    style={{ maxHeight: '210px', objectFit: 'contain' }}
                  />
                  </Link>
                </div>
                <div className="card-body d-flex flex-column text-center">
                  <h5 className="card-title text-truncate">{item.title}</h5>
                  <p className="card-text fw-semibold text-dark mb-3 fs-5">₹{item.price}</p>
                  <div className="d-flex justify-content-center gap-2">
                    <NavLink to={`/products/${item.product_id}`} className="btn btn-outline-dark btn-sm w-50">
                      Buy Now
                    </NavLink>
                    <button
                      className="btn btn-dark btn-sm w-50"
                      onClick={() => handleRemove(item.product_id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
