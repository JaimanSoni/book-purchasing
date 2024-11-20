import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false); 
  const [accessToken, setAccessToken] = useState(null)
  const API_URL = "";
  const loginAsAdmin = () => setIsAdmin(true);
  const logout = () => setIsAdmin(false);


  const setNewAccessToken = async () => {
    const response = await axiosInstance.post(`/api/admin/refresh-token`, null, 
      {
        withCredentials: true
      }
    )
    if(response.status == 403){
      logout();
      console.log("object")
      if(localStorage.getItem("adminAccessToken")){
        localStorage.removeItem("adminAccessToken")
      }
    }

    if(response.data.success){
      setAccessToken(response.data.accessToken)
      localStorage.removeItem("adminAccessToken")
      localStorage.setItem("adminAccessToken", response.data.accessToken)
    }
  }


  useEffect(()=>{
    if(localStorage.getItem("adminAccessToken")){
      setAccessToken(localStorage.getItem("adminAccessToken"));
      loginAsAdmin();
    }
  }, [])

  return (
    <AuthContext.Provider value={{ isAdmin, loginAsAdmin, logout, accessToken, setAccessToken, API_URL, setNewAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
