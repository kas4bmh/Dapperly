import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaPlus, FaShoppingCart } from 'react-icons/fa';

const API_BASE_URL = 'https://dapperly-bpcbh3erbzc4ckhh.eastasia-01.azurewebsites.net';
const ProductList = () => {
  const { addToCart } = useCart();
  const { token, loggedInUser, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    if (!token) return;

    axios.get(`${API_BASE_URL}/api/Service/allProducts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        const fetchedProducts = response.data;
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);

        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(fetchedProducts.map(p => p.category || 'Uncategorized'))];
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        if (error.response?.status === 401) logout();
      });
  }, [token, logout]);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);

    if (selected === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p => p.category === selected);
      setFilteredProducts(filtered);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* Filter Dropdown */}
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <label htmlFor="categoryFilter" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
          Filter by Category:
        </label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {filteredProducts.length > 0 ? filteredProducts.map(product => (
          <div
            key={product.id}
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            <div style={{ width: '100%', height: '150px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
              <img
                src={product.imageBaseUrl}
                alt={product.productName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
            <h3 style={{ margin: '0.5rem 0 0.2rem' }}>{product.productName}</h3>
            <p style={{ margin: 0 }}>₹{product.price}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
              {loggedInUser["role"]=="User" && (<button
                style={{
                  padding: '0.4rem 0.8rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                onClick={(e) => { e.preventDefault(); addToCart(product); }}
              >
                <FaShoppingCart /> <FaPlus style={{ fontSize: '0.7rem' }} />
              </button>
)}
              {loggedInUser["role"] === "Admin" && (
                <button
                  style={{
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#ffc107',
                    color: 'black',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/add-edit-product/${product.id}`)}
                >
                  <FaEdit />
                </button>
              )}
            </div>
          </div>
        )) : (
          <h2 style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            No products available. Contact admin to add products.
          </h2>
        )}
      </div>
    </div>
  );
};

export default ProductList;
