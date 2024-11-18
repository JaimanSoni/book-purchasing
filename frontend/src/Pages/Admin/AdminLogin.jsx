import React, { useState, useEffect } from 'react'

export default function AdminLogin() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleShowPassword = () => {
        if (showPassword) {
            setShowPassword(false)
        } else {
            setShowPassword(true)
        }
    }

    return (
        <div className='bg-slate-200 min-h-screen h-fit flex justify-center items-center' >
            <div className=' w-[300px] sm:w-[400px] min-h-[300px] h-fit bg-white rounded-[20px] shadow-lg py-[20px] px-[30px] '>
                <h1 className=' text-[28px] sm:text-[33px] font-medium text-center text-[#434343]'>
                    Admin Login
                </h1>
                <form action="" className='flex flex-col justify-center items-center gap-[30px] mt-[30px]'>
                    <input required type="text" name='username' value={username} onChange={(e) => setUsername(e.target.value)} className='focus:outline-none focus:border-b-[2px] w-full h-[30px] px-[5px] text-[#717171] ' placeholder='Enter Email' />
                    <div className='w-full flex items-center'>
                        <input required type={showPassword ? "text" : "password"} name="password" value={password} onChange={(e) => setPassword(e.target.value)} className='focus:outline-none focus:border-b-[2px] w-full h-[30px] px-[5px] text-[#717171] ' placeholder='Enter Password' />

                        {
                            showPassword ?
                                <i className="fa-solid fa-eye text-[#323232] cursor-pointer" onClick={handleShowPassword}></i>
                                :
                                <i className="fa-solid fa-eye-slash text-[#323232] cursor-pointer" onClick={handleShowPassword}></i>
                        }
                    </div>
                    <button type="submit" className='bg-slate-500 text-white w-[100%] h-[35px] rounded-[10px]'>Submit</button>
                </form>
            </div>
        </div >
    )
}
