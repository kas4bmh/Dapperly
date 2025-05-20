// src/components/Navbar.js
import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import '../css/NavBar.css'
import { FaShoppingCart , FaPlus,FaBoxOpen,FaHome } from 'react-icons/fa'; 
import { useCart } from '../components/CartContext';
import { useAuth } from './AuthContext';

const Navbar = () => {
      const { cart } = useCart(); // Get the cart state from the CartContext
  const cartCount = cart.length;

 const { isAuthenticated, logout,loggedInUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/products">Dapperly – B2B eCommerce Platform</Link>
        </div>
        <ul className="navbar-links">  
           <li style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={()=>{navigate("/products")}}>
            <button className="home">
            Home <FaHome title='home' style={{ marginRight: '0.5rem' }} />
            </button>
        </li>        
         { loggedInUser["role"]!="Admin" &&(<li><Link to="/cart" className="cart-icon">
         <button className="cart">
          Cart <FaShoppingCart title='Cart' style={{ marginRight: '0.5rem' }} />
             {cartCount > 0 && <span className="cart-count">{cartCount}</span>} {/* Show cart count if there are items */}
             </button>
          </Link></li>)}
          {loggedInUser["role"]=="Admin"?
          <li style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <button className="AddProducts" onClick={()=>navigate("/add-edit-product/")}>
            Add Products <FaPlus style={{ marginRight: '0.5rem' }} />
          </button>
        </li>:<></>}
        {loggedInUser["role"]!="Admin"?
        <li><Link to="/myorders" className="FaBoxOpen">
             <button className="orderButton" onClick={()=>{navigate(`/myorders/${loggedInUser["id"]}`)}}>
            My Orders<span><FaBoxOpen title='order' style={{ marginRight: '0.5rem' }} /></span>
          </button>
          </Link></li>:<></>}
              {isAuthenticated && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

