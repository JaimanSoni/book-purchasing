import React, { useEffect } from "react";

export default function AdminError(props) {
  return (
    <div className="w-full h-screen bg-slate-100 flex justify-center items-center flex-col ">
      <video className="w-[400px] h-[400px]" loop autoPlay>
        <source src="/error.webm" type="video/webm" />
      </video>
      <div className=" text-[25px] sm:text-[35px] font-thin text-[#717171] text-center ">
        Oops! You cannot access this page.
      </div>
      {props.message ? null : (
        <>
          <p className="text-[#717171] text-[14px] text-center">
            Click below button to login and access this page
          </p>
          <div className="flex gap-[10px] flex-wrap justify-center items-center pb-[30px] px-[10px]">
            <a
              href="/admin/login"
              className="w-[100px] h-[40px] mt-[20px] bg-slate-400 text-[20px] rounded-[10px] flex justify-center items-center text-white"
            >
              Login
            </a>
            <a
              href="/"
              className="w-[150px] h-[40px] mt-[20px] bg-slate-400 text-[20px] rounded-[10px] flex justify-center items-center text-white"
            >
              Go to home
            </a>
          </div>
        </>
      )}
    </div>
  );
}
