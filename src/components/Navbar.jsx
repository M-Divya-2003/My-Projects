import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { emptyCart } from '../redux/actions';

const Navbar = () => {
  const [profile, setProfile] = useState(null);
  const cart = useSelector((state) => state.handleCart || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/profile/${userId}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleLogout = () => {
    if (userId) {
      localStorage.removeItem(`cart_${userId}`);
    }
    dispatch(emptyCart());
    localStorage.clear();
    alert('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-4 text-dark" to="/home">
          FURNITURE STORE
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/home">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/products">
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <NavLink to="/cart" className="btn btn-outline-dark btn-sm">
              🛒 Cart
            </NavLink>

            <NavLink to="/orders" className="btn btn-outline-dark btn-sm">
              My Orders
            </NavLink>

            <NavLink to="/wishlist" className="btn btn-outline-dark btn-sm">
              wishlist
            </NavLink>

            <button onClick={handleLogout} className="btn btn-outline-dark btn-sm">
              Logout
            </button>

            <NavLink to="/profile" className="ms-2">
              <img
                src={
                  profile?.profile_image
                    ? `http://localhost:5000${profile.profile_image}`
                    : '/assets/default.png'
                }
                alt="Profile"
                className="rounded-circle border border-dark"
                style={{ width: '45px', height: '45px', objectFit: 'cover' }}
              />
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
