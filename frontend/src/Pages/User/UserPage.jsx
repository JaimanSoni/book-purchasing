import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import Loading2 from "../../Components/Loading"

const BookStore = ({ cart, addToCart, removeFromCart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [Books, setBooks] = useState(null);

  const getBooks = async () => {
    const loadingToast = toast.loading("Fetching books...");
    try {
      const response = await axios.get(
        "http://localhost:3000/api/books/all-books"
      );

      if (response.data.success) {
        setBooks(response.data.books);
        // toast.success("Books fetched successfully!");
      } else {
        toast.error("Failed to fetch books.");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("An error occurred while fetching books.");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  const filteredBooks =
    Books == null
      ? null
      : Books.filter((book) =>
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
        {Books == null ? (
          <div className="w-[100%] min-h-[500px] flex justify-center items-center">
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div key={book.book_id} className="border rounded-lg p-4 flex flex-col">
              <img
                src={book.image_url}
                alt={book.title}
                className="w-full h-[270px] object-cover mb-4 rounded"
              />
              <h2 className="text-lg font-semibold mb-2">{book.title}</h2>
              <p className="text-xl font-medium mb-4">₹{book.price}</p>
              <div className="flex justify-between items-center mt-auto">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removeFromCart(book.id)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    disabled={!cart.find((item) => item.book_id === book.book_id)}
                  >
                    -
                  </button>
                  <span>
                    {cart.find((item) => item.book_id === book.book_id)?.quantity || 0}
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
          ))
        )}
      </div>
    </div>
  );
};

export default BookStore;
