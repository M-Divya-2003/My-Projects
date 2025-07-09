import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import axios from 'axios';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!userId) {
      alert('Please log in to add items to cart.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cart/add', {
        userId,
        productId: product.id,
      });
      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding product to cart:', err);
      alert('Failed to add product to cart');
    }
  };

  const Loading = () => <div>Loading...</div>;

  const ShowProduct = () => (
    <>
      <div className="col-md-6">
        <img
          src={product.image_url}
          alt={product.name}
          height="400px"
          width="400px"
        />
      </div>
      <div className="col-md-6">
        <h4 className="text-uppercase text-black-50">{product.category}</h4>
        <h1 className="display-5">{product.name}</h1>
        <p className="lead fw-bolder">
          Rating {product.rating} <i className="fa fa-star"></i>
        </p>
        <h3 className="display-6 fw-bold my-4">₹{product.price}</h3>
        <p className="lead">{product.description}</p>
        <button className="btn btn-outline-dark px-4 py-2" onClick={handleAddToCart}>
          Add to Cart
        </button>
        <NavLink to="/cart" className="btn btn-dark ms-2 px-3 py-2">
          Go to Cart
        </NavLink>
      </div>
    </>
  );

  return (
    <div className="container py-5">
      <div className="row py-5">{loading ? <Loading /> : <ShowProduct />}</div>
    </div>
  );
};

export default Product;
