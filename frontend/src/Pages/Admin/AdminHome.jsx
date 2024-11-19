import React, { useState } from 'react'
import { useAuth } from '../../Context/AuthContext'
import { useNavigate } from "react-router-dom";


const TotalComponents = () => {
    return (
        <div className='w-full py-[20px] px-[20px] rounded-[5px] border-[1px] border-[#cdcdcd]'>
            <div className='text-[22px] font-medium'>
                Total Books
            </div>
            <div className='mt-[10px] text-[25px] font-medium'>
                5
            </div>
        </div>
    )
}

export default function AdminHome() {
    const {logout} = useAuth()
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState("Books")
    const changePage = () => {
        setCurrentPage(currentPage == "Books" ? "Orders" : "Books")
    }

    const handleLogout = () => {
        logout()
        navigate("/admin/login")
    }
    const Books = [
        { id: 1, title: 'John Doe', author: "Jaiman Soni", price: "$90", stock: 20 },
        { id: 2, title: 'Jane Smith', author: "Jaiman Soni", price: "$90", stock: 20 },
        { id: 3, title: 'Mark Taylor', author: "Jaiman Soni", price: "$90", stock: 20 },
        { id: 3, title: 'Mark Taylor', author: "Jaiman Soni", price: "$90", stock: 20 },
        { id: 3, title: 'Mark Taylor', author: "Jaiman Soni", price: "$90", stock: 20 },
        { id: 3, title: 'Mark Taylor', author: "Jaiman Soni", price: "$90", stock: 20 },
        { id: 3, title: 'Mark Taylor', author: "Jaiman Soni", price: "$90", stock: 20 },
        { id: 3, title: 'Mark Taylor', author: "Jaiman Soni", price: "$90", stock: 20 },
    ];
    return (
        <div className='bg-white w-full min-h-screen h-fit px-[20px] pb-[50px]'>
            <div className='w-full flex justify-between items-center py-[20px] '>
                <div className=' text-[20px] sm:text-[25px] text-black font-medium'>
                    Admin Dasboard
                </div>
                <button className='text-white bg-black w-[70px] text-[15px] sm:w-[100px] h-[35px] rounded-[5px]'>
                    Logout
                </button>
            </div>
            <div className='w-[150px] mt-[30px] cursor-pointer h-[45px] rounded-[5px] bg-[#f3f3f3] px-[4px] py-[4px] flex justify-center items-center'>
                <div onClick={changePage} className={`rounded-[2px] shadow-sm h-full w-full flex justify-center items-center ${currentPage == "Books" ? "bg-white" : ""} `}>
                    Books
                </div>
                <div onClick={changePage} className={`rounded-[2px] shadow-sm h-full w-full flex justify-center items-center ${currentPage == "Orders" ? "bg-white" : ""} `}>
                    Orders
                </div>
            </div>

            {/* bottom container  */}
            {
                currentPage == "Books"

                    ?

                    <div className=' mt-[15px] '>
                        <div className='flex justify-between items-center h-[40px]'>
                            <div className='h-full'>
                                <input type="text" name="" id="" className='h-full w-[180px] sm:w-[300px] rounded-[5px] border-[1px] border-[#cdcdcd] px-[10px]' placeholder='Search...' />
                            </div>
                            <button className='text-white bg-black w-[110px] text-[15px] sm:w-[150px] h-[40px] rounded-[5px]'>
                                + Add Book
                            </button>
                        </div>
                        <div className='mt-[15px] overflow-scroll h-[400px] border-[1px] border-[#cdcdcd] rounded-[5px] px-[20px] py-[10px]'>
                            <h1 className='text-[23px] font-medium'>
                                Book Inventory
                            </h1>
                            <table border="1" className='overflow-scroll w-[650px] sm:w-full' style={{ borderCollapse: 'collapse', textAlign: 'left', }}>
                                <thead>
                                    <tr className='h-[60px]'>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Books.map(book => (
                                        <tr key={book.id} className='h-[60px] border-t-[1px] border-[#cdcdcd] cursor-pointer hover:bg-gray-50'>
                                            <td>{book.title}</td>
                                            <td>{book.author}</td>
                                            <td>{book.price}</td>
                                            <td>{book.stock}</td>
                                            <td>
                                                <button className='w-[60px] h-[35px] rounded-[3px] text-[15px] border-[1px] border-[#cdcdcd]'>
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    :

                    <div className=' mt-[15px] '>
                        <div className='mt-[15px] overflow-scroll h-[400px] border-[1px] border-[#cdcdcd] rounded-[5px] px-[20px] py-[10px]'>
                            <h1 className='text-[23px] font-medium'>
                                Orders
                            </h1>
                            <table border="1" className='overflow-scroll w-[650px] sm:w-full' style={{ borderCollapse: 'collapse', textAlign: 'left', }}>
                                <thead>
                                    <tr className='h-[60px]'>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Books.map(book => (
                                        <tr key={book.id} className='h-[60px] border-t-[1px] border-[#cdcdcd] cursor-pointer hover:bg-gray-50'>
                                            <td>{book.title}</td>
                                            <td>{book.author}</td>
                                            <td>{book.price}</td>
                                            <td>{book.stock}</td>
                                            <td>
                                                <button className='w-[60px] h-[35px] rounded-[3px] text-[15px] border-[1px] border-[#cdcdcd]'>
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
            }
            <div className='flex sm:flex-row flex-col gap-[10px] mt-[15px]'>
                <TotalComponents />
                <TotalComponents />
            </div>
        </div>
    )
}
