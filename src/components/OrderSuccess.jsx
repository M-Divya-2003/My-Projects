import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useDispatch } from 'react-redux';
import { emptyCart } from '../redux/actions';

const OrderSuccess = () => {
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
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

  useEffect(() => {
    dispatch(emptyCart());
    localStorage.removeItem("cart");

    const fetchOrder = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/checkout/latest-order/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrder(res.data.order);

        let parsedItems;
        try {
          parsedItems = typeof res.data.order.items === 'string'
            ? JSON.parse(res.data.order.items)
            : res.data.order.items;

          setOrderItems(Array.isArray(parsedItems) ? parsedItems : []);
        } catch (e) {
          console.error('Error parsing order items:', e);
          setOrderItems([]);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      }
    };

    fetchOrder();
  }, [userId, token, dispatch]);

    const generatePDF = () => {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('jsPDF is not loaded. Make sure the CDN is included.');
    return;
  }

  const doc = new window.jspdf.jsPDF();

  if (typeof doc.autoTable !== 'function') {
    alert('autoTable plugin is not loaded. Ensure the jspdf-autotable CDN is added *after* jsPDF.');
    return;
  }

  const total = orderItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  // Title
  doc.setFontSize(18);
  doc.text('Order Receipt', 105, 20, { align: 'center' });

  // Order Info
  doc.setFontSize(12);
  const lineSpacing = 8;
  let y = 30;

  doc.text(`Order ID: ${order.id}`, 14, y); y += lineSpacing;
  doc.text(`Name: ${order.name}`, 14, y); y += lineSpacing;
  doc.text(`Phone: ${order.phone_no}`, 14, y); y += lineSpacing;
  doc.text(`Address: ${order.address}`, 14, y); y += lineSpacing;
  doc.text(`Payment Method: ${order.payment_method}`, 14, y); y += lineSpacing;

  // Table
  const tableColumn = ["Product", "Qty", "Price (INR)", "Subtotal (INR)"];
  const tableRows = orderItems.map(item => [
    item.name,
    item.qty.toString(),
    `${item.price}`,
    `${(item.qty * item.price).toFixed(2)}`
  ]);

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: y + 5,
    styles: {
      halign: 'center',
      fontSize: 11,
    },
    headStyles: {
      fillColor: [0, 123, 255],
      textColor: 255,
    },
    columnStyles: {
      0: { halign: 'left' }, // left-align product name
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' },
    },
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // Total Amount
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`Total: (INR) ${total.toFixed(2)}`, 195, finalY, { align: 'right' });

  // Save PDF
  doc.save(`Order_${order.id}.pdf`);
};

  const printReceipt = () => {
    window.print();
  };

  if (!order || !Array.isArray(orderItems) || orderItems.length === 0) {
    return <div className="text-center mt-5">Loading order details...</div>;
  }

  return (
    <div className="container mt-4" style={{ maxWidth: '800px' }}>
      <h2 className="text-center mb-4">🎉 Order Placed Successfully!</h2>
      <div className="card shadow p-4">
        <h4>Order ID: {order.id}</h4>
        <p><strong>Name:</strong> {order.name}</p>
        <p><strong>Phone:</strong> {order.phone_no}</p>
        <p><strong>Address:</strong> {order.address}</p>
        <p><strong>Payment:</strong> {order.payment_method}</p>

        <table className="table table-bordered mt-4">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>₹{item.price}</td>
                <td>₹{item.qty * item.price}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end fw-bold">Total</td>
              <td className="fw-bold">₹{order.total}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary" onClick={generatePDF}>📄 Download PDF</button>
          <button className="btn btn-secondary" onClick={printReceipt}>🖨️ Print</button>
          <button className="btn btn-dark ms-auto" onClick={() => navigate('/products')}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

