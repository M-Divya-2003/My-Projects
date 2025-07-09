import React from 'react';
import Products from './Products';
import { jwtDecode } from 'jwt-decode';

const Home = () => {
  let userId = null;

  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (error) {
      console.error('Invalid token');
    }
  }

  return (
    <div className="hero">
      {/* Banner Section */}
      <div className="position-relative">
        <img
          src="../assets/bg-01.jpeg"
          alt="Banner"
          className="img-fluid w-100"
          style={{ height: '550px', objectFit: 'cover' }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex  text-white"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <div className="container">
            <h1 className="display-3 fw-bold mb-3">NEW COLLECTIONS ARE ARRIVED</h1>
            <p className="lead fs-3">CHECK OUT ALL THE TRENDS</p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container py-5">
        <Products />
      </div>
    </div>
  );
};

export default Home;
