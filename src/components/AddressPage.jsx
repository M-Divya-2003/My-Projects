import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { emptyCart } from '../redux/actions';
import { QRCodeCanvas } from 'qrcode.react';

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');

  const cart = useSelector(state => state.handleCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (err) {
      console.error('Invalid token');
    }
  }

  const total = cart?.reduce((acc, item) => acc + (item.qty || 0) * item.price, 0);

  useEffect(() => {
    if (!userId) return;

    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`http://13.51.235.169:5000/api/checkout/addresses/${userId}`);
        setAddresses(res.data);
      } catch (err) {
        console.error('Error fetching addresses:', err);
      }
    };

    fetchAddresses();

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [userId]);

  const placeOrder = async (addressToUse, method) => {
    try {
      const response = await axios.post(
        'http://13.51.235.169:5000/api/checkout/checkout',
        {
          userId,
          cartItems: cart,
          address: addressToUse,
          paymentMethod: method,
          total,
          name,
          phone_no: phoneNo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        dispatch(emptyCart());
        localStorage.removeItem('cart');
        alert('Order Placed Successfully!');
        navigate('/order-success');
      }
    } catch (err) {
      console.error('Order error:', err.response?.data || err.message);
      alert('Order failed: ' + (err.response?.data?.error || 'Server error'));
    }
  };

  const handleRazorpayPayment = async (addressToUse) => {
    if (typeof window.Razorpay === 'undefined') {
      alert('Razorpay SDK not loaded. Please wait a moment and try again.');
      return;
    }

    try {
      const res = await axios.post('http://13.51.235.169:5000/api/checkout/razorpay-order', { total });

      const options = {
        key: 'rzp_test_EH1UEwLILEPXCj',
        amount: res.data.amount,
        currency: 'INR',
        name: 'Furniture Store',
        description: 'Order Payment',
        order_id: res.data.id,
        handler: function () {
          placeOrder(addressToUse, 'RazorPay');
        },
        prefill: {
          name,
          contact: phoneNo,
        },
        theme: { color: '#000' },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error('Razorpay error:', error.response?.data || error.message);
      alert('Failed to initiate Razorpay payment.');
    }
  };

  const handlePlaceOrder = () => {
    const addressToUse = newAddress.trim() || selectedAddress;

    if (!name || !phoneNo || !addressToUse || !paymentMethod) {
      return alert('Please fill all required fields.');
    }

    if (paymentMethod === 'GPay' && !paymentConfirmed) {
      return alert('Please confirm GPay payment before proceeding.');
    }

    if (paymentMethod === 'RazorPay') {
      return handleRazorpayPayment(addressToUse);
    }

    placeOrder(addressToUse, paymentMethod);
  };

  return (
    <div className="container my-5" style={{ fontFamily: `'Courier New', monospace`, color: '#000' }}>
      <h2 className="text-center mb-4 fw-bold border-bottom pb-2">Billing Summary</h2>

      {/* 🧾 Billing Table */}
      <div className="card border-dark shadow-sm mb-4 bg-white">
        <div className="card-body p-0">
          <table className="table table-bordered mb-0 text-center">
            <thead className="table-dark text-white">
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.qty * item.price}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-light fw-bold">
              <tr>
                <td colSpan="3" className="text-end">Total</td>
                <td>₹{total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 👤 Customer Info */}
      <div className="card border-dark shadow-sm mb-4 bg-white">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Customer Info</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <input
                type="tel"
                className="form-control"
                placeholder="Phone Number"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🏠 Address Selection */}
      <div className="card border-dark shadow-sm mb-4 bg-white">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Delivery Address</h5>
          {addresses.length === 0 && <p className="text-muted">No saved addresses found.</p>}
          {addresses.map((addr, index) => (
            <div className="form-check" key={index}>
              <input
                className="form-check-input"
                type="radio"
                name="address"
                value={addr}
                checked={selectedAddress === addr && newAddress === ''}
                onChange={() => {
                  setSelectedAddress(addr);
                  setNewAddress('');
                }}
              />
              <label className="form-check-label">{addr}</label>
            </div>
          ))}

          <label className="form-label mt-3">Or Enter New Address</label>
          <textarea
            className="form-control"
            rows="3"
            value={newAddress}
            onChange={(e) => {
              setNewAddress(e.target.value);
              setSelectedAddress('');
            }}
            placeholder="Enter new address"
          ></textarea>
        </div>
      </div>

      {/* 💳 Payment Method */}
      <div className="card border-dark shadow-sm mb-4 bg-white">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Payment Method</h5>
          {['COD', 'GPay', 'RazorPay'].map((method) => (
            <div className="form-check" key={method}>
              <input
                className="form-check-input"
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
              />
              <label className="form-check-label">{method}</label>
            </div>
          ))}

          {paymentMethod === 'GPay' && (
  <div className="d-flex flex-column align-items-center mt-4">
    <p className="text-center">Scan this QR Code to Pay via GPay</p>
    <QRCodeCanvas
      value={`upi://pay?pa=divya28112003@okhdfcbank&pn=Divya&am=${total}&cu=INR`}
      size={180}
    />
    <button className="btn btn-dark mt-3" onClick={() => setPaymentConfirmed(true)}>
      ✅ I've Paid
    </button>
  </div>
)}

        </div>
      </div>

      {/* ✅ Place Order Button */}
      <div className="d-grid">
        <button className="btn btn-lg btn-dark fw-bold" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default AddressPage;
