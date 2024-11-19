import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/User/Home";
import { toast } from "react-hot-toast";
import AdminHome from "./Pages/Admin/AdminHome";
import AdminLogin from "./Pages/Admin/AdminLogin";
import AddNewBook from "./Pages/Admin/AddNewBook";
import AdminSignup from "./Pages/Admin/AdminSignup";
import ProtectedRoute from "./Components/ProtectedRoute";
import OrderDetails from "./Pages/Admin/OrderDetails"

const App = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
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
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prevCart.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <>
      <Router>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />


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
          <Route
            path="/admin/add-new-book"
            element={
              <ProtectedRoute>
                <AddNewBook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/order-details"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
