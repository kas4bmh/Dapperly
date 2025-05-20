// src/routes.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'; // <-- Use Navigate for redirects
import ProductPage from './pages/ProductsPage';
import CartPage from './pages/cart';
import SignInPage from './components/SignIn';
import { useAuth } from './components/AuthContext'; // <-- Use AuthContext
import Navbar from './components/NavBar';
import PaymentPage from './pages/PaymentPage';
import AddEditProduct from './components/Admin/AddEditProducts';
import BillingPage from './pages/BillingPage';
import OrderPage from './pages/Order';

const AppRoutes = () => {
  const { loggedInUser,isAuthenticated } = useAuth(); // Check if user is authenticated

  return (
    <div>
          {isAuthenticated && <Navbar />} {/* Render Navbar only if user is authenticated */}
      <Routes>
        <Route
          path="/sign-in"
          element={isAuthenticated ? <Navigate to="/products" /> : <SignInPage />} // If authenticated, go to products
        />
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/products" /> : <SignInPage />} // Redirect to products if authenticated
        />
        <Route
          path="/products"
          element={isAuthenticated ? <ProductPage /> : <Navigate to="/sign-in" />} // Redirect to sign-in if not authenticated
        />
        <Route
          path="/cart"
          element={isAuthenticated && (loggedInUser["role"]!="Admin")  ? <CartPage /> : <Navigate to="/sign-in" />} // Redirect to sign-in if not authenticated
        />
          <Route
          path="/payment"
          element={isAuthenticated && (loggedInUser["role"]!="Admin") ? <PaymentPage /> : <Navigate to="/sign-in" />} // Redirect to sign-in if not authenticated
        />

          <Route
          path="/add-edit-product/:id?"
          element={isAuthenticated && (loggedInUser["role"]=="Admin") ? <AddEditProduct /> : <Navigate to="/sign-in" />} // Redirect to sign-in if not authenticated
        />

             <Route
          path="/billing"
          element={isAuthenticated && (loggedInUser["role"]!="Admin")  ? <BillingPage /> : <Navigate to="/sign-in" />} // Redirect to sign-in if not authenticated
        />

             <Route
          path="/myorders/:userId?"
          element={isAuthenticated && (loggedInUser["role"]!="Admin")   ? <OrderPage /> : <Navigate to="/sign-in" />} // Redirect to sign-in if not authenticated
        />
      </Routes>
    </div>
  );
};

export default AppRoutes;
