import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    let isMounted = true;
    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const products = await response.json();
        if (isMounted) {
          setData(products);
          setFilter(products);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
        const wishlistProductIds = res.data.map(item => item.product_id);
        setWishlist(wishlistProductIds);
      } catch (err) {
        console.error("Error fetching wishlist", err);
      }
    };
    fetchWishlist();
  }, [userId]);

  const handleAddToWishlist = async (productId) => {
    if (wishlist.includes(productId)) return;
    setWishlist((prev) => [...prev, productId]);
    try {
      await axios.post("http://localhost:5000/api/wishlist", {
        userId,
        productId,
      });
    } catch (err) {
      console.error("Error adding to wishlist", err);
    }
  };

  const filterProducts = (category) => {
    if (category === "All") {
      setFilter(data);
    } else {
      const updatedList = data.filter((product) => product.category === category);
      setFilter(updatedList);
    }
  };

  const Loading = () => <h2 className="text-center my-5">Loading...</h2>;

  const ShowProducts = () => (
    <>
      <div className="buttons d-flex flex-wrap justify-content-center mb-5 gap-2">
        {["All", "Wooden Furniture", "Glass Furniture", "Steel Furniture"].map((cat) => (
          <button
            key={cat}
            className="btn btn-outline-dark"
            onClick={() => filterProducts(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="row justify-content-center">
        {filter.map((product) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={product.id}>
            <div className="card h-100 shadow-sm">
              <div className="d-flex justify-content-center align-items-center bg-white" style={{ height: "250px" }}>
                <img
                  className="img-fluid"
                  src={product.image_url}
                  alt={product.name}
                  style={{ maxHeight: '210px', objectFit: "contain" }}
                />
              </div>
              <div className="card-body d-flex flex-column text-center">
                <h5 className="card-title mb-2 text-truncate">{product.name}</h5>
                <p className="card-text lead fw-bold mb-3">₹{product.price}</p>
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <NavLink to={`/products/${product.id}`} className="btn btn-outline-dark btn-sm w-50 me-1">
                    Buy Now
                  </NavLink>
                  <button
                    className={`btn btn-sm w-50 ${wishlist.includes(product.id) ? "btn-danger" : "btn-outline-danger"}`}
                    onClick={() => handleAddToWishlist(product.id)}
                  >
                    {wishlist.includes(product.id) ? "❤️ Added" : "🤍 Wishlist"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="container my-5 py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-6 fw-bolder text-center">Latest Products</h1>
          <hr />
        </div>
      </div>
      {loading ? <Loading /> : <ShowProducts />}
    </div>
  );
};

export default Products;
