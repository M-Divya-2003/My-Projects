import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${userId}`);
        setOrders(res.data); // Backend should return orders with `items` array
      } catch (err) {
        console.error('Failed to load order history:', err);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-dark">
        🧾 My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-muted">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Order #{order.id}</h5>
              <p className="card-text mb-1"><i className="fa fa-user me-2" /> <strong>Username:</strong> {order.username}</p>
              <p className="card-text mb-1"><i className="fa fa-calendar me-2" /> <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
              <p className="card-text mb-3"><i className="fa fa-credit-card me-2" /> <strong>Total:</strong> ₹{order.total}</p>

              {order.items?.length > 0 && (
                <>
                  <h6 className="fw-bold">📦 Items:</h6>
                  <ul className="list-group list-group-flush">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="list-group-item px-0">
                        {item.name} — {item.quantity} × ₹{item.price} = ₹{(item.quantity * item.price).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
