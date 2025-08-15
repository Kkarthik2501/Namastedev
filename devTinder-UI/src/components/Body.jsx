import { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../utils/userSlice'

import Cookies from 'js-cookie';
const Body = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const fetchData = async () => {
        try {
            setLoading(true);
            if (!Cookies.get('token')) {
                navigate('/login');
                return;
            }

            await dispatch(fetchUser());

            navigate('/feed');

        }
        catch (err) {
            console.log("err", err)
            navigate('/login');
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {

        fetchData();
    }, [Cookies.get('token')])
    if (loading) {
        return <div>Loading.....</div>
    }

    return (
        <div>
            {/* used to render child routes */}
            <NavBar />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Body