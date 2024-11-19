import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading2 from "../../Components/Loading";
import FormatDateTime from "../../../utils/FormatDateTime";

const TotalComponents = ({ title, count }) => {
  return (
    <div className="w-full py-[20px] px-[20px] rounded-[5px] border-[1px] border-[#cdcdcd]">
      <div className="text-[22px] font-medium">{title}</div>
      <div className="mt-[10px] text-[25px] font-medium">{count}</div>
    </div>
  );
};

export default function AdminHome() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [Books, setBooks] = useState(null);
  const [Orders, setOrders] = useState(null);
  const [bookCount, setBookCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  const [currentPage, setCurrentPage] = useState("Books");
  const changePage = () => {
    setCurrentPage(currentPage == "Books" ? "Orders" : "Books");
  };

  const getAllBooks = async () => {
    const response = await axios.get(
      "http://localhost:3000/api/books/all-books"
    );

    if (response) {
      if (response.data.success) {
        setBooks(response.data.books);
      }
    }
  };

  const getAllOrders = async () => {
    const response = await axios.get("http://localhost:3000/api/admin/orders");

    if (response) {
      setOrders(response.data.orders);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  useEffect(() => {
    getAllBooks();
    getAllOrders();
  }, []);

  useEffect(() => {
    if (Books) {
      setBookCount(Books.length);
    }
  }, [Books]);
  useEffect(() => {
    if (Orders) {
      setOrderCount(Orders.length);
    }
  }, [Orders]);

  // const Books = [
  //     { id: 1, title: 'John Doe', author: "Jaiman Soni", price: "$90", stock: 20 },
  //     { id: 2, title: 'Jane Smith', author: "Jaiman Soni", price: "$90", stock: 20 },
  //     { id: 3, title: 'Mark Taylor', author: "Jaiman Soni", price: "$90", stock: 20 },
  //     { id: 3, title: 'Mark Taylor', author: "Jaiman Soni", price: "$90", stock: 20 },
  //     { id: 3, title: 'Mark Taylor', author: "Jaiman Soni", price: "$90", stock: 20 },
  //     { id: 3, title: 'Mark Taylor', author: "Jaiman Soni", price: "$90", stock: 20 },
  //     { id: 3, title: 'Mark Taylor', author: "Jaiman Soni", price: "$90", stock: 20 },
  //     { id: 3, title: 'Mark Taylor', author: "Jaiman Soni", price: "$90", stock: 20 },
  // ];
  return (
    <div className="bg-white w-full min-h-screen h-fit px-[10px] sm:px-[20px] pb-[50px]">
      <div className="w-full flex gap-[10px] justify-between items-center py-[20px] ">
        <div className=" text-[20px] sm:text-[25px] text-black font-medium">
          Admin Dasboard
        </div>
        <div className="flex gap-[3vw]">
          <a
            href="/admin/create-user"
            className="text-white bg-black w-[80px] text-[14px] sm:w-[100px] h-[30px] sm:h-[35px] rounded-[5px] flex justify-center items-center"
          >
            Create User
          </a>
          <button
            className="text-white bg-black w-[60px] text-[14px] sm:w-[100px] h-[30px] sm:h-[35px] rounded-[5px]"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="w-[150px] mt-[30px] cursor-pointer h-[45px] rounded-[5px] bg-[#f3f3f3] px-[4px] py-[4px] flex justify-center items-center">
        <div
          onClick={() => {
            changePage();
            getAllBooks();
          }}
          className={`rounded-[2px] shadow-sm h-full w-full flex justify-center items-center ${
            currentPage == "Books" ? "bg-white" : ""
          } `}
        >
          Books
        </div>
        <div
          onClick={() => {
            changePage();
            getAllOrders();
          }}
          className={`rounded-[2px] shadow-sm h-full w-full flex justify-center items-center ${
            currentPage == "Orders" ? "bg-white" : ""
          } `}
        >
          Orders
        </div>
      </div>

      {/* bottom container  */}
      {currentPage == "Books" ? (
        <div className=" mt-[15px] ">
          <div className="flex justify-between items-center h-[40px]">
            <div className="h-full">
              <input
                type="text"
                name=""
                id=""
                className="h-full w-[180px] sm:w-[300px] rounded-[5px] border-[1px] border-[#cdcdcd] px-[10px]"
                placeholder="Search..."
              />
            </div>
            <a
              href="/admin/add-new-book"
              className="flex justify-center items-center text-white bg-black w-[110px] text-[15px] sm:w-[150px] h-[40px] rounded-[5px]"
            >
              + Add Book
            </a>
          </div>
          <div className="mt-[15px] overflow-scroll h-[400px] border-[1px] border-[#cdcdcd] rounded-[5px] px-[20px] py-[10px]">
            <h1 className="text-[23px] font-medium">Book Inventory</h1>
            <table
              border="1"
              className="overflow-scroll w-[650px] sm:w-full"
              style={{ borderCollapse: "collapse", textAlign: "left" }}
            >
              <thead>
                <tr className="h-[60px]">
                  <th className="min-w-[250px]">Title</th>
                  <th className="min-w-[80px]">Price</th>
                  <th className="min-w-[80px]">Stock</th>
                  <th className="min-w-[150px]">Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Books == null ? (
                  <tr>
                    <td colSpan="5">
                      <div className="flex justify-start items-start sm:justify-center sm:items-center w-[80vw] sm:w-full h-[280px]">
                        <Loading2 />
                      </div>
                    </td>
                  </tr>
                ) : (
                  Books.map((book) => (
                    <tr
                      key={book.book_id}
                      className="h-[60px] border-t-[1px] border-[#cdcdcd] cursor-pointer hover:bg-gray-50"
                    >
                      <td>{book.title}</td>
                      <td>₹{book.price}</td>
                      <td>{book.stock}</td>
                      <td><FormatDateTime isoDate={book.created_at} /></td>
                      <td>
                        <a href={`/admin/add-new-book/${book.book_id}`} className="flex justify-center items-center w-[60px] h-[35px] rounded-[3px] hover:bg-[#cfcfcf] text-[15px] border-[1px] border-[#cdcdcd]">
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className=" mt-[15px] ">
          <div className="mt-[15px] overflow-scroll h-[400px] border-[1px] border-[#cdcdcd] rounded-[5px] px-[20px] py-[10px]">
            <h1 className="text-[23px] font-medium">Orders</h1>
            <table
              border="1"
              className="overflow-scroll w-[750px] sm:w-full"
              style={{ borderCollapse: "collapse", textAlign: "left" }}
            >
              <thead>
                <tr className="h-[60px]">
                  <th className="min-w-[80px]">Order ID</th>
                  <th className="min-w-[80px]">User Name</th>
                  <th className="min-w-[120px]">Enrollment Number</th>
                  <th className="min-w-[80px]">Price</th>
                  <th className="min-w-[80px]">Ordered At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Orders == null ? (
                  <tr>
                    <td colSpan="5">
                      <div className="flex justify-start items-start sm:justify-center sm:items-center w-[80vw] sm:w-full h-[280px]">
                        <Loading2 />
                      </div>
                    </td>
                  </tr>
                ) : (
                  Orders.map((order) => (
                    <tr
                      key={order.order_id}
                      className="h-[60px] border-t-[1px] border-[#cdcdcd] cursor-pointer hover:bg-gray-50"
                    >
                      <td>{order.order_id}</td>
                      <td>{order.name}</td>
                      <td>{order.enrollment_number}</td>
                      <td>₹{order.total_price}</td>
                      <td>{order.ordered_at}</td>
                      <td>
                        <button className="w-[100px] h-[35px] hover:bg-[#cfcfcf] rounded-[3px] text-[15px] border-[1px] border-[#cdcdcd]">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="flex sm:flex-row flex-col gap-[10px] mt-[15px]">
        <TotalComponents title={"Total Books"} count={bookCount} />
        <TotalComponents title={"Total Orders"} count={orderCount} />
      </div>
    </div>
  );
}
