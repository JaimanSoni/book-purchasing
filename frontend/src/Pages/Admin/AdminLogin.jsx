import React, { useState } from 'react';
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast';
import axiosInstance from '../../../utils/axiosInstance';

export default function AdminLogin() {
    const { loginAsAdmin, setAccessToken } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Toggle password visibility
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();

        const data = {
            username,
            password,
        };

        try {
            const response = await axiosInstance.post(`http://localhost:3000/api/admin/login`, data);

            if (response && response.data.success) {
                // Success toast
                toast.success("Login successful!");
                loginAsAdmin();
                localStorage.setItem("adminAccessToken", response.data.accessToken)
                setAccessToken(response.data.accessToken);
                navigate("/admin/dashboard");
            } else {
                // Error toast
                toast.error(response.data.message || "Invalid credentials.");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };


    return (
        <div className="bg-slate-200 min-h-screen h-fit flex justify-center items-center">
            <Toaster position="top-center" reverseOrder={false} /> {/* Toast container */}
            <div className="w-[300px] sm:w-[400px] min-h-[300px] h-fit bg-white rounded-[20px] shadow-lg py-[20px] px-[30px]">
                <h1 className="text-[28px] sm:text-[33px] font-medium text-center text-[#434343]">
                    Admin Login
                </h1>
                <form
                    className="flex flex-col justify-center items-center gap-[30px] mt-[30px]"
                    onSubmit={handleLogin}
                >
                    {/* Username Input */}
                    <input
                        required
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="focus:outline-none focus:border-b-[2px] w-full h-[30px] px-[5px] text-[#717171]"
                        placeholder="Enter Username"
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
                            placeholder="Enter Password"
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
