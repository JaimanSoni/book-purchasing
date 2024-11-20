import React, { useState } from "react";
import { toast } from "react-hot-toast";

import CartPage from "./CartPage";
import BookStore from "./UserPage";

export default function Home() {
  const [cart, setCart] = useState([]);

 const addToCart = (book) => {     
  // console.log('Adding book to cart:', book);      
  setCart((prevCart) => {       
    const existingItem = prevCart.find((item) => item.book_id === book.book_id);       
    if (existingItem) {         
      return prevCart.map((item) =>           
        item.book_id === book.book_id 
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
      const existingItem = prevCart.find((item) => item.book_id === id);
      if (existingItem?.quantity > 1) {
        return prevCart.map((item) =>
          item.book_id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prevCart.filter((item) => item.book_id !== id);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div>
      <BookStore
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />
      <CartPage
        cart={cart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
    </div>
  );
}
