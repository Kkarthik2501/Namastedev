import { useDispatch, useSelector } from 'react-redux'
import { SendConnectionRequest } from '../utils/connectionSlice'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
const UserCard = () => {
    const feed = useSelector((store) => store.feedSlice.feed)
    const [data, setData] = useState(feed.users || [])
    const dispatch = useDispatch()
    useEffect(() => {
        setData(feed.users)
    }, [feed])
    const handleConnection = async (feed, status) => {
        const response = await dispatch(SendConnectionRequest({ feed, status }))
        console.log(response)
        if (response.payload?.success == true) {
            toast.success("Connection Request Sent Successfully");
            setData(data.filter((item) => item._id != feed._id));
        }
        else {
            toast.error("Failed to send connection request");
        }
    }
    return (
        data?.length == 0 ? <h1 className='text-3xl-font-bold'>No Users Found</h1> :
            data?.map((feed) => {
                return (
                    < div className="card bg-base-300 mx-2 w-96 shadow-2xl " key={feed._id}>
                        <figure>
                            <img
                                src={feed.photoURL}
                                alt="Shoes" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">{feed.firstName + ' ' + feed.lastName}</h2>
                            <p>{feed.aboud ? feed.aboud : ''}</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-secondary" onClick={() => handleConnection(feed, "ignored")}>Ignore</button>
                                <button className="btn btn-primary" onClick={() => handleConnection(feed, "interested")}>Send Request</button>
                            </div>
                        </div>
                    </div >)
            })
    )


}

export default UserCard