import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import axiosInstance from "../../../utils/axiosInstance";
import {useNavigate} from "react-router-dom"

export default function AdminSignup() {
    const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Password show/hide toggle
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Password validation function
  const validatePassword = () => {
    if (password !== password2) {
      toast.error("Passwords do not match.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters.");
      return false;
    }

    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      toast.error("Password must contain both letters and numbers.");
      return false;
    }

    return true;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!validatePassword()) return; // Stop if password validation fails

    const data = {
      username: username,
      email: email,
      password: password,
    };

    try {
        const response = await axiosInstance.post("/api/admin/register", data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminAccessToken")}`,
          },
          }
        );
        if(response.status == 401){
          logout();
          navigate("/admin/login")
        }
        if (response && response.data.success) {
            toast.success("Admin created successfully!");
            navigate("/admin/dashboard")
        } else {
            toast.error("Failed to create admin.");
        }
    } catch (error) {
        toast.error(error.response.data.message);
        console.error(error);
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen h-fit flex justify-center items-center">
      <Toaster position="top-center" reverseOrder={false} />{" "}
      {/* Toast container */}
      <div className="w-[300px] sm:w-[400px] min-h-[300px] h-fit bg-white rounded-[20px] shadow-lg py-[20px] px-[30px]">
        <h1 className="text-[28px] sm:text-[33px] font-medium text-center text-[#434343]">
          Create Admin
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-[30px] mt-[30px]"
        >
          {/* Username Input */}
          <input
            required
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="focus:outline-none focus:border-b-[2px] w-full h-[30px] px-[5px] text-[#717171]"
            placeholder="Enter Name"
          />

          {/* Email Input */}
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:outline-none focus:border-b-[2px] w-full h-[30px] px-[5px] text-[#717171]"
            placeholder="Enter Email"
          />

          {/* Password Input */}
          <div className="w-full flex items-center">
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:outline-none focus:border-b-[2px] w-full h-[30px] px-[5px] text-[#717171]"
              placeholder="Create Password"
            />
            {showPassword ? (
              <i
                className="fa-solid fa-eye text-[#323232] cursor-pointer"
                onClick={handleShowPassword}
              ></i>
            ) : (
              <i
                className="fa-solid fa-eye-slash text-[#323232] cursor-pointer"
                onClick={handleShowPassword}
              ></i>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="w-full flex items-center">
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="focus:outline-none focus:border-b-[2px] w-full h-[30px] px-[5px] text-[#717171]"
              placeholder="Confirm Password"
            />
            {showPassword ? (
              <i
                className="fa-solid fa-eye text-[#323232] cursor-pointer"
                onClick={handleShowPassword}
              ></i>
            ) : (
              <i
                className="fa-solid fa-eye-slash text-[#323232] cursor-pointer"
                onClick={handleShowPassword}
              ></i>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-slate-500 text-white w-[100%] h-[35px] rounded-[10px]"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
