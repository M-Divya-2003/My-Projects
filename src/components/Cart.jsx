import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCart } from '../redux/actions';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        setCartItems(res.data);
        dispatch(setCart(res.data));
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };
    fetchCart();
  }, [userId, dispatch]);

  const handleAdd = async (product) => {
    if (product.qty >= product.stock) {
      alert(`Only ${product.stock} item(s) in stock`);
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/cart/add`, { userId, productId: product.id });
      setCartItems(prev =>
        prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleDel = async (product) => {
    try {
      await axios.post(`http://localhost:5000/api/cart/remove`, { userId, productId: product.id });
      setCartItems(prev =>
        prev
          .map(item =>
            item.id === product.id ? { ...item, qty: item.qty - 1 } : item
          )
          .filter(item => item.qty > 0)
      );
    } catch (err) {
      console.error('Error removing product:', err);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="container py-5 text-center">
        <h3 className="mb-4 text-muted">🛒 Your cart is empty</h3>
        <NavLink to="/products" className="btn btn-dark btn-lg">
          Shop Now
        </NavLink>
      </div>
    );
  }

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold border-bottom pb-2">🛍️ Your Shopping Cart</h2>

      {cartItems.map((item) => (
        <div key={item.id} className="row g-3 align-items-center border rounded p-3 mb-4 shadow-sm bg-light">
          <div className="col-md-3 text-center">
            <img
              src={item.image_url}
              alt={item.name}
              className="img-fluid rounded"
              style={{ height: '120px', objectFit: 'cover' }}
            />
          </div>
          <div className="col-md-6">
            <h5 className="fw-bold">{item.name}</h5>
            <p className="text-muted small mb-1">{item.description}</p>
            <p className="mb-1">
              Qty: <strong>{item.qty}</strong> × ₹{item.price} ={' '}
              <strong className="text-success">₹{item.qty * item.price}</strong>
            </p>
            <p className="text-secondary small">In stock: {item.stock}</p>
          </div>
          <div className="col-md-3 text-md-end text-center">
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => handleDel(item)}
              title="Remove"
            >
              <i className="fa fa-minus"></i>
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => handleAdd(item)}
              title="Add"
            >
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>
      ))}

      {/* Total & Proceed Button */}
      <div className="d-flex flex-column align-items-end mt-4">
        <h4 className="fw-bold mb-3">Total: ₹{totalPrice}</h4>
        <NavLink to="/BuyNow" className="btn btn-dark btn-lg px-4">
          Proceed to Buy
        </NavLink>
      </div>
    </div>
  );
};

export default Cart;
