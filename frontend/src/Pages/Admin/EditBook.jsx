import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";
import { toast, Toaster } from "react-hot-toast";
import {useNavigate} from "react-router-dom";

export default function AddNewBook() {
  const { id } = useParams();

  const navigate = useNavigate()

  // State Variables
  const [bookID, setBookID] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const posterInputRef = useRef(null);
  const [posterImg, setPosterImg] = useState(null);
  const [selectedPoster, setSelectedPoster] = useState(null);

  // Fetch Book Details
  const getBookDetails = async () => {
    const loadingToast = toast.loading("Loading book details...");
    try {
      const response = await axiosInstance.get(
        `http://localhost:3000/api/books/book/${id}`,
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
      if (response.data.success) {
        setBookID(response.data.book.book_id);
        setTitle(response.data.book.title);
        setPrice(response.data.book.price);
        setStock(response.data.book.stock);
        setPosterImg(response.data.book.image_url);
        toast.success("Book details loaded successfully!");
      } else {
        toast.error("Failed to load book details.");
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
      toast.error("Failed to load book details. Please try again later.");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // Use Effect to Fetch Book Data on Component Load
  useEffect(() => {
    if (id) {
      getBookDetails();
    }
  }, [id]);

  // Submit Updated Book Details
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append form data
    formData.append("title", title);
    formData.append("price", price);
    formData.append("stock", stock);

    // Append image if a new image is selected
    if (selectedPoster) {
      formData.append("image", selectedPoster); // The key "image" must match what the backend expects
    }

    const loadingToast = toast.loading("Updating book details...");
    try {
      // Send formData via POST or PUT
      const response = await axiosInstance.put(
        `http://localhost:3000/api/books/update-book/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",

            Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
          },
        }
      );
      if(response.status == 401){
        logout();
        navigate("/admin/login")
      }
      if (response.data.success) {
        toast.success("Book updated successfully!");
        navigate("/admin/dashboard")
      } else {
        toast.error("Failed to update book. Please try again.");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("An error occurred while updating the book.");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // Poster Drag and Drop Handlers
  const handleDragOverPoster = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropPoster = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPosterImg(event.target.result);
      };
      reader.readAsDataURL(files[0]);
      setSelectedPoster(files[0]);
    }
  };

  const handlePosterChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPosterImg(event.target.result);
      };
      reader.readAsDataURL(files[0]);
      setSelectedPoster(files[0]);
    }
  };

  const handlePosterClick = () => {
    posterInputRef.current.click();
  };

  const handleRemovePoster = () => {
    setPosterImg(null);
    setSelectedPoster(null);
    posterInputRef.current.value = "";
  };

  // Component UI
  return (
    <div className="bg-slate-100 flex justify-center items-center w-full h-fit py-[50px] min-h-screen">
      <div className="w-[80%] bg-white px-[20px] py-[25px] shadow-md h-fit min-h-[400px] rounded-[15px]">
        <Toaster position="top-center" />
        <div className="flex justify-between items-center">
          <h1 className="text-[27px] font-medium">Edit Book</h1>
          <a
            href="/admin/dashboard"
            className="w-[60px] h-[35px] bg-black flex justify-center items-center text-white rounded-[5px]"
          >
            Home
          </a>
        </div>
        <form
          className="flex flex-col gap-[30px] mt-[30px]"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="text-[17px] outline-none focus:border-b-2 w-[70%]"
            name="title"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="text-[17px] outline-none focus:border-b-2 w-[70%]"
            name="price"
            placeholder="Book Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            className="text-[17px] outline-none focus:border-b-2 w-[70%]"
            name="stock"
            placeholder="Book Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <div className="flex flex-col justify-center items-center gap-[30px]">
            <div
              className={`relative shadow-md cursor-pointer flex justify-center items-center ${
                posterImg
                  ? "overflow-hidden w-[300px] h-[300px]"
                  : "h-[300px] w-[300px]"
              } rounded-[10px] bg-slate-50`}
              onDragOver={handleDragOverPoster}
              onDrop={handleDropPoster}
              onClick={handlePosterClick}
            >
              {posterImg ? (
                <img
                  src={posterImg}
                  className="w-full rounded-[10px]"
                  alt="Dropped Poster"
                />
              ) : (
                <h1 className="text-[23px] px-[20px] sm:text-[28px] font-medium text-center text-[#686d72]">
                  Drag and Drop or Click to select image
                </h1>
              )}
              <input
                type="file"
                ref={posterInputRef}
                onChange={handlePosterChange}
                accept="image/*"
                className="w-full h-full hidden"
              />
            </div>
            {posterImg && (
              <button
                type="button"
                className="text-sm text-red-500 mt-2"
                onClick={handleRemovePoster}
              >
                Remove Poster
              </button>
            )}
            <button
              type="submit"
              className="bg-black text-white w-[200px] h-[40px] rounded-[5px]"
            >
              Update Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
