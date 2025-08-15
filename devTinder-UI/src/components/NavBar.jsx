import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser, removeUser } from '../utils/userSlice'
import { Link, useNavigate } from 'react-router-dom'
const NavBar = () => {
    const navigate = useNavigate()
    const store = useSelector((store) => store.userSlice)
    const userIcon = store?.user?.data?.photoURL || store?.user?.photoURL
    const dispatch = useDispatch()
    const handleLogout = () => {
        console.log("logout")
        dispatch(removeUser());
        dispatch(logoutUser())
        navigate('/login')

    }

    return (
        <div className="navbar bg-base-200 shadow-sm">
            <div className="flex-1">
                <Link to='/feed' className="btn btn-ghost text-xl">DevTinder</Link>
            </div>
            <div className="flex gap-2">
                {/* <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" /> */}
                {userIcon &&
                    <div className="dropdown dropdown-end mx-5">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src={userIcon} />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>
                                <Link to='/profile' className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </Link>
                            </li>
                            <li><Link to='/connections'>Connections</Link></li>
                            <li><Link to='/requests'>Requests</Link></li>
                            <li onClick={handleLogout}><a>Logout</a></li>
                        </ul>
                    </div>}
            </div>
        </div>
    )
}

export default NavBar