import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import axiosInstance from "../../../utils/axiosInstance"

const CartPage = ({ cart, removeFromCart, clearCart }) => {
  
  const [cartItems, setCartItems] = useState(cart);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    enrollmentId: "",
    semester: "",
    branch: "",
    college: "",
    email: "",
  });

  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  const handleRemoveItem = (id) => {
    removeFromCart(id);
    toast.success("Item removed from cart");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (formData.enrollmentId.length < 5) {
      toast.error("Please enter a valid enrollment number");
      return false;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const loadingToast = toast.loading("Placing your order...");

    try {
      const loadingToast = toast.loading("Placing your order...");
  
      // Making the API request with axios
      const response = await axiosInstance.post(
          "/api/orders/place-order",
          {
              userData: {
                  username: formData.userName,
                  email: formData.email,
                  enrollment_number: formData.enrollmentId,
                  branch: formData.branch,
                  college: formData.college,
                  semester: formData.semester,
              },
              orderDetails: {
                  total_price: total,
              },
              items: cartItems.map((item) => ({
                  book_id: item.book_id,
                  quantity: item.quantity,
                  price: item.price,
              })),
          },
          {
              headers: { "Content-Type": "application/json" },
          }
      );
  
      // Handling the response
      if (response.data.success) {
          toast.success("Order placed successfully!", { id: loadingToast });
          clearCart(); // Clear the cart after successful order placement
          setFormData({
              userName: "",
              enrollmentId: "",
              semester: "",
              branch: "",
              college: "",
              email: "",
          });
      } else {
          throw new Error(response.data.message || "Failed to place order");
      }
  } catch (error) {
      // Handling errors
      toast.error(error.message || "Failed to place order. Please try again.", {
          id: loadingToast,
      });
  } finally {
      setLoading(false); // Ensure the loading state is updated
  }
  
  };

  // Check if all distinct books are selected at least once
  const allItemsSelectedOnce =
    cartItems.length === 8 && cartItems.every((item) => item.quantity >= 1);

  // Calculate total with conditional discount
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = allItemsSelectedOnce ? 500 : 0;
  const total = subtotal - discount;

  return (
    <div className="max-w-[1200px] mx-auto p-5" id="cart">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-bold mb-5">Your Cart</h1>

      <div className="space-y-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left border-b">Book</th>
                <th className="p-3 text-left border-b">Price</th>
                <th className="p-3 text-left border-b">Quantity</th>
                <th className="p-3 text-left border-b">Subtotal</th>
                <th className="p-3 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.book_id}>
                  <td className="p-3 border-b">{item.title}</td>
                  <td className="p-3 border-b">₹{item.price}</td>
                  <td className="p-3 border-b">{item.quantity}</td>
                  <td className="p-3 border-b">
                    ₹{item.price * item.quantity}
                  </td>
                  <td className="p-3 border-b">
                    <button
                      onClick={() => handleRemoveItem(item.book_id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold">Subtotal: ₹{subtotal.toFixed(2)}</p>
          {allItemsSelectedOnce && (
            <p className="text-green-600">Discount Applied: -₹{discount}</p>
          )}
          <p className="text-2xl font-bold mt-2">Total: ₹{total.toFixed(2)}</p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Checkout Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries({
              userName: "Name",
              enrollmentId: "Enrollment Number",
              email: "Email ID",
              semester: "Semester",
              branch: "Branch",
              college: "College",
            }).map(([key, label]) => (
              <div key={key}>
                <label htmlFor={key} className="block mb-1">
                  {label}
                </label>
                <input
                  id={key}
                  name={key}
                  type={key === "email" ? "email" : "text"}
                  value={formData[key]}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                  disabled={loading}
                />
              </div>
            ))}

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
