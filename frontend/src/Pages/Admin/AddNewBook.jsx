import React, { useRef, useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddNewBook() {
    const navigate = useNavigate()
  const posterInputRef = useRef(null);
  const [posterImg, setPosterImg] = useState(null);
  const [selectedPoster, setSelectedPoster] = useState(null);

  const [title, setTitle] = useState("")
  const [price, setPrice] = useState(null)
  const [stock, setStock] = useState(null) 
  

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !stock || !selectedPoster) {
      toast.error("Please fill all fields and select at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("images", selectedPoster)

    try {
      const loadingToast = toast.loading("Uploading book details...");

      const response = await axios.post(
        "http://localhost:3000/api/books/add-book",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.dismiss(loadingToast);

      if (response.data.success) {
        toast.success("Book added successfully!");
        setTitle("");
        setPrice("");
        setStock("");
        navigate("/admin/dashboard")
        fileInputRef.current.value = null; // Reset file input
      } else {
        toast.error("Failed to add book. Please try again.");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      toast.dismiss();
      toast.error("An error occurred while adding the book.");
    }
  };

  return (
    <div className=" bg-slate-100 flex justify-center items-center w-full h-fit py-[50px] min-h-screen">
      <div className="w-[80%] bg-white px-[20px] py-[25px] shadow-md h-fit min-h-[400px] rounded-[15px] ">
        <div className="flex justify-between items-center">
          <h1 className="text-[27px] font-medium">Add New Book</h1>
          <a
            href="/admin/dashboard"
            className="w-[60px] h-[35px] bg-black flex justify-center items-center text-white rounded-[5px]"
          >
            Home
          </a>
        </div>
        <form action="" className="flex flex-col gap-[30px] mt-[30px]" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            className="text-[17px] outline-none focus:border-b-2 w-[70%] "
            name="title"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="text-[17px] outline-none focus:border-b-2 w-[70%] "
            name="price"
            placeholder="Book Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            className="text-[17px] outline-none focus:border-b-2 w-[70%] "
            name="stock"
            placeholder="Book Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <div className="flex flex-col justify-center items-center gap-[30px]">
            <div
              className={`relative shadow-md  cursor-pointer  flex justify-center items-center  ${
                posterImg
                  ? " overflow-hidden w-[300px] h-[300px] "
                  : " h-[300px] w-[300px]"
              } rounded-[10px] bg-slate-50`}
              onDragOver={handleDragOverPoster}
              onDrop={handleDropPoster}
              onClick={handlePosterClick}
            >
              {posterImg ? (
                <>
                  <img
                    src={posterImg}
                    className="w-full  rounded-[10px]"
                    alt="Dropped Image"
                  />
                </>
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
                required
              />
            </div>
            <button className="bg-black text-white w-[200px] h-[40px] rounded-[5px]">
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
