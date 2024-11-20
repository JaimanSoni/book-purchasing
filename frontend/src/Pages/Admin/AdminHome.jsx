import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading2 from "../../Components/Loading";
import FormatDateTime from "../../../utils/FormatDateTime";
import { toast, Toaster } from "react-hot-toast"; // Importing Toaster and toast
import axiosInstance from "../../../utils/axiosInstance";

const TotalComponents = ({ title, count }) => {
  return (
    <div className="w-full py-[20px] px-[20px] rounded-[5px] border-[1px] border-[#cdcdcd]">
      <div className="text-[22px] font-medium">{title}</div>
      <div className="mt-[10px] text-[25px] font-medium">{count}</div>
    </div>
  );
};

const List = ({ id, title, price, stock, date, image }) => {
  return (
    <>
      <div className="my-[15px] relative pr-[35px] flex items-center sm:items-start gap-[15px] md:gap-[30px] m-auto px-[10px] md:px-[20px] py-[20px] hover:bg-slate-50 rounded-none sm:rounded-[10px] cursor-pointer ">
        <div className=" w-[90px] md:w-[120px] bg-slate-50 rounded-[10px]">
          {console.log(image)}
          <img className="rounded-[10px]" src={image} alt="" />
        </div>
        <div className="flex justify-center flex-col  pt-[5px]">
          <h1 className="text-[19px] xsm:text-[21px] md:text-[25px] m-0">
            {title}
          </h1>
          <p className=" text-[14px] md:text-[17px] mb-[5px]">
            <FormatDateTime isoDate={date} />
          </p>
          <p className=" text-[13px] md:text-[16px] m-0">Price: ₹{price}</p>
          <p className=" text-[13px] md:text-[16px] m-0">Stock: {stock}</p>
        </div>
      </div>
      <hr />
    </>
  );
};

export default function AdminHome() {
  const { logout, setNewAccessToken } = useAuth();
  const navigate = useNavigate();

  const [Books, setBooks] = useState(null);
  const [Orders, setOrders] = useState(null);
  const [Admins, setAdmins] = useState(null);
  const [bookCount, setBookCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  const [currentPage, setCurrentPage] = useState("Books");
  const changePage = () => {
    setCurrentPage(currentPage === "Books" ? "Orders" : "Books");
  };

  const getAllBooks = async () => {
    try {
      const loadingToast = toast.loading("Fetching books...");
      const response = await axiosInstance.get(
        "http://localhost:3000/api/books/all-books"
      );
      toast.dismiss(loadingToast);

      if (response && response.data.success) {
        setBooks(response.data.books);
        // toast.success("Books fetched successfully!");
      }
    } catch (error) {
      toast.error("Failed to fetch books!");
      console.error(error);
    }
  };
  const getAllAdmins = async () => {
    try {
      const loadingToast = toast.loading("Fetching Admins...");
      const response = await axiosInstance.get(
        "http://localhost:3000/api/admin/all-admin",

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
          },
        }
      );
      if (response.status == 401) {
        logout();
        navigate("/admin/login");
      }
      toast.dismiss(loadingToast);

      if (response && response.data.success) {
        setAdmins(response.data.admins);
        // toast.success("Admins fetched successfully!");
      }
    } catch (error) {
      toast.error("Failed to fetch admins!");
      console.error(error);
    }
  };

  const getAllOrders = async () => {
    const loadingToast = toast.loading("Fetching orders...");

    try {
        // Attempt to fetch orders
        const response = await axiosInstance.get("http://localhost:3000/api/admin/orders", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
            },
        });

        // If successful, update state and show success toast
        if (response && response.data.orders) {
            setOrders(response.data.orders);
            // toast.success("Orders fetched successfully!");
        }
    } catch (error) {
        // Dismiss the loading toast
        toast.dismiss(loadingToast);

        // Handle 401 errors (token expiration)
        if (error.response && error.response.status === 401) {
            try {
                console.log("Access token expired. Attempting to refresh...");
                // Call a function to refresh the token
                await setNewAccessToken();

                // Retry fetching orders after refreshing token
                const retryResponse = await axiosInstance.get("http://localhost:3000/api/admin/orders", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
                    },
                });

                if (retryResponse && retryResponse.data.orders) {
                    setOrders(retryResponse.data.orders);
                    // toast.success("Orders fetched successfully!");
                }
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                toast.error("Session expired. Please log in again.");
                navigate("/admin/login"); // Redirect to login page
            }
        } else {
            // Handle other errors
            console.error("Error fetching orders:", error);
            toast.error("Failed to fetch orders. Please try again.");
        }
    } finally {
        toast.dismiss(loadingToast); // Ensure toast is dismissed in all cases
    }
};


  const handleLogout = async () => {
    const response = await axiosInstance.get(`http://localhost:3000/api/admin/logout`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
      },
    });
    if (response.status == 401) {
      logout();
      navigate("/admin/login");
    }
    localStorage.clear();
    logout();
    navigate("/admin/login");
    toast.success("Logged out successfully!");
  };

  const deleteBook = async (id) => {
    const confirmDelete = await new Promise((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col items-center">
            <p className="mb-4">
              Are you sure you want to delete this flashcard?
            </p>
            <div className="flex gap-2">
              <button
                variant="outline"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="w-[50px] border-[1px] border-[#000000] rounded-[5px] h-[30px]"
              >
                Yes
              </button>
              <button
                variant="outline"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="w-[50px] border-[1px] border-[#000000] rounded-[5px] h-[30px]"
              >
                No
              </button>
            </div>
          </div>
        ),
        {
          duration: 5000,
          position: "top-center",
        }
      );
    });

    if (!confirmDelete) return;
    try {
      const loadingToast = toast.loading("Deleting book...");
      await axiosInstance.delete(`http://localhost:3000/api/books/book/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
        },
      });
      toast.dismiss(loadingToast);

      toast.success("Book deleted successfully!");
      setBooks((prevBooks) => prevBooks.filter((book) => book.book_id !== id));
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to delete the book!");
      console.error(error);
    }
  };
  const deleteAdmin = async (id, name) => {
    const confirmDelete = await new Promise((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col items-center">
            <p className="mb-4">
              Are you sure you want to delete admin - {name}?
            </p>
            <div className="flex gap-2">
              <button
                variant="outline"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="w-[50px] border-[1px] border-[#000000] rounded-[5px] h-[30px]"
              >
                Yes
              </button>
              <button
                variant="outline"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="w-[50px] border-[1px] border-[#000000] rounded-[5px] h-[30px]"
              >
                No
              </button>
            </div>
          </div>
        ),
        {
          duration: 5000,
          position: "top-center",
        }
      );
    });

    if (!confirmDelete) return;
    try {
      const loadingToast = toast.loading("Deleting Admin...");
      await axiosInstance.delete(`http://localhost:3000/api/admin/delete-admin/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
        },
      });
      // if (response.status == 401) {
      //   logout();
      //   navigate("/admin/login");
      // }
      toast.dismiss(loadingToast);

      toast.success("Admin deleted successfully!");
      getAllAdmins();
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to delete the Admin!");
      console.error(error);
    }
  };

  useEffect(() => {
    getAllOrders();
    getAllBooks();
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

  return (
    <div className="bg-white w-full min-h-screen h-fit px-[10px] sm:px-[20px] pb-[50px]">
      <Toaster position="top-center" reverseOrder={false} />{" "}
      {/* Toast container */}
      <div className="w-full flex gap-[10px] justify-between items-center py-[20px]">
        <div className="text-[20px] sm:text-[25px] text-black font-medium">
          Admin Dashboard
        </div>
        <div className="flex gap-[10px] sm:gap-[20px]">
          <a
            href="/admin/create-user"
            className="text-white bg-black w-[80px] text-[14px] sm:w-[100px] h-[30px] sm:h-[35px] rounded-[5px] flex justify-center items-center"
          >
            Create Admin
          </a>
          <button
            className="text-white bg-black w-[60px] text-[14px] sm:w-[100px] h-[30px] sm:h-[35px] rounded-[5px]"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="w-[300px] mt-[30px] cursor-pointer h-[45px] rounded-[5px] bg-[#f3f3f3] px-[4px] py-[4px] flex justify-center items-center">
        <div
          onClick={() => {
            setCurrentPage("Books");
            getAllBooks();
          }}
          className={`rounded-[2px] shadow-sm h-full w-full flex justify-center items-center ${
            currentPage === "Books" ? "bg-white" : ""
          }`}
        >
          Books
        </div>
        <div
          onClick={() => {
            setCurrentPage("Orders");
            getAllOrders();
          }}
          className={`rounded-[2px] shadow-sm h-full w-full flex justify-center items-center ${
            currentPage === "Orders" ? "bg-white" : ""
          }`}
        >
          Orders
        </div>
        <div
          onClick={() => {
            setCurrentPage("Admins");
            getAllAdmins();
          }}
          className={`rounded-[2px] shadow-sm h-full w-full flex justify-center items-center ${
            currentPage === "Admins" ? "bg-white" : ""
          }`}
        >
          See Admins
        </div>
      </div>
      {/* Books Section */}
      {currentPage === "Books" ? (
        <div className="mt-[15px]">
          <div className="flex justify-between items-center h-[40px]">
            <div className="h-full">
              <input
                type="text"
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
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Books === null ? (
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
                      <td>
                        <FormatDateTime isoDate={book.created_at} />
                      </td>
                      <td>
                        <div className="flex gap-[10px] items-center justify-center h-full">
                          <a
                            href={`/admin/edit-book/${book.book_id}`}
                            className="flex justify-center items-center w-[60px] h-[35px] rounded-[3px] hover:bg-[#cfcfcf] text-[15px] border-[1px] border-[#cdcdcd]"
                          >
                            Edit
                          </a>
                          <button
                            onClick={() => deleteBook(book.book_id)}
                            className="flex justify-center items-center w-[60px] h-[35px] rounded-[3px] bg-[#ff2c2c] text-[15px] border-[1px] border-[#cdcdcd]"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : currentPage === "Orders" ? (
        <div className=" mt-[15px]">
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
                {Orders === null ? (
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
      ) : (
        <div className=" mt-[15px]">
          <div className="mt-[15px] overflow-scroll h-[400px] border-[1px] border-[#cdcdcd] rounded-[5px] px-[20px] py-[10px]">
            <h1 className="text-[23px] font-medium">Admins</h1>
            <table
              border="1"
              className="overflow-scroll w-[750px] sm:w-full"
              style={{ borderCollapse: "collapse", textAlign: "left" }}
            >
              <thead>
                <tr className="h-[60px]">
                  <th className="min-w-[80px]">ID</th>
                  <th className="min-w-[80px]">Admin Name</th>
                  <th className="min-w-[120px]">Email</th>
                  <th className="min-w-[80px]">Created At</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Admins === null ? (
                  <tr>
                    <td colSpan="5">
                      <div className="flex justify-start items-start sm:justify-center sm:items-center w-[80vw] sm:w-full h-[280px]">
                        <Loading2 />
                      </div>
                    </td>
                  </tr>
                ) : (
                  Admins.map((admin) => (
                    <tr
                      key={admin.admin_id}
                      className="h-[60px] border-t-[1px] border-[#cdcdcd] cursor-pointer hover:bg-gray-50"
                    >
                      <td>{admin.admin_id}</td>
                      <td>{admin.username}</td>
                      <td>{admin.email}</td>
                      <td>
                      <FormatDateTime isoDate={admin.created_at}/> 
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            deleteAdmin(admin.admin_id, admin.username)
                          }
                          className="m-auto flex justify-center items-center w-[60px] h-[35px] rounded-[3px] bg-[#ff2c2c] text-[15px] border-[1px] border-[#cdcdcd]"
                        >
                          Delete
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
