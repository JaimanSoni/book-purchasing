import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CartPage from './Pages/CartPage';
import BookStore from './Pages/UserPage';
import { toast } from 'react-hot-toast';
import AdminHome from './Pages/Admin/AdminHome';
import AdminLogin from './Pages/Admin/AdminLogin';
import AddNewBook from './Pages/Admin/AddNewBook';
import AdminError from './Pages/Admin/AccessDenied';
import AdminSignup from "./Pages/Admin/AdminSignup"

const App = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
    toast.success("Added to cart");
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id);
      if (existingItem?.quantity > 1) {
        return prevCart.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    // <div>
    //   <BookStore
    //     cart={cart}
    //     addToCart={addToCart}
    //     removeFromCart={removeFromCart}
    //   />
    //   <CartPage
    //     cart={cart}
    //     removeFromCart={removeFromCart}
    //     clearCart={clearCart}
    //   />
    // </div>

    <>
      <Router>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-user"
            element={
              <ProtectedRoute>
                <AdminSignup />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>


      <AdminHome />
      <AdminLogin />
      <AddNewBook />
      <AdminError />
    </>
  );
};

export default App;