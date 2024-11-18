// BookStore.jsx
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const BookStore = ({ cart, addToCart, removeFromCart }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const books = [
    {
      id: 1,
      title: "Basics of Financial Management",
      price: 250,
      image: "book1.jpg",
    },
    { id: 2, title: "E-Commerce", price: 250, image: "book2.jpg" },
    { id: 3, title: "Emotional Intelligence", price: 250, image: "book3.jpg" },
    {
      id: 4,
      title: "Information System and Enterprise Resource Planning",
      price: 250,
      image: "book4.jpg",
    },
    {
      id: 5,
      title: "Leadership and Influence",
      price: 250,
      image: "book5.jpg",
    },
    {
      id: 6,
      title: "Fundamentals of Marketing Management",
      price: 250,
      image: "book6.jpg",
    },
    { id: 7, title: "Research Methodology", price: 250, image: "book7.jpg" },
    { id: 8, title: "Stress Management", price: 250, image: "book8.jpg" },
  ];

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-[1200px] mx-auto p-5">
      <Toaster position="top-center" />
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">BookStore</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-full sm:w-64"
          />
          <a
            href="#cart"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
          >
            Cart ({totalItems})
          </a>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="border rounded-lg p-4 flex flex-col">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-[270px] object-cover mb-4 rounded"
            />
            <h2 className="text-lg font-semibold mb-2">{book.title}</h2>
            <p className="text-xl font-medium mb-4">₹{book.price.toFixed(2)}</p>
            <div className="flex justify-between items-center mt-auto">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => removeFromCart(book.id)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={!cart.find((item) => item.id === book.id)}
                >
                  -
                </button>
                <span>
                  {cart.find((item) => item.id === book.id)?.quantity || 0}
                </span>
                <button
                  onClick={() => addToCart(book)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => addToCart(book)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookStore;