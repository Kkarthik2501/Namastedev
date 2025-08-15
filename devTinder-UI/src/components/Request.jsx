import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AcceptIgnoreRequest, requestReceived } from '../utils/connectionSlice'

const Request = () => {
    const dispatch = useDispatch()

    const requestReceivedData = useSelector((store) => store.connectionSlice.requestReceived.data)
    const [requestData, setRequestData] = useState(requestReceivedData)
    const fetchData = async () => {
        const response = await dispatch(requestReceived())
        setRequestData(response.payload.data)
    }
    useEffect(() => {
        fetchData()
    }, [])
    if (!requestReceivedData || requestReceivedData.length === 0) {
        return <h2 className='text-center text-2xl'>No Requests Found</h2>
    }
    const handleRequest = async (connection, status) => {
        const response = await dispatch(AcceptIgnoreRequest({ connection, status }))
        if (response.payload?.success == true) {
            fetchData()
        }
    }
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}><h1 className='font-semibold text-lg'>Requests Received</h1></div>

            <div className='flex justify-center'>
                <div className='flex flex-col gap-4 w-full max-w-sm'>
                    {requestReceivedData.map((connection) => (
                        <div key={connection.fromUserId._id} className='flex gap-3 my-3 border rounded-3xl border-amber-50 items-center p-3 shadow-md'>
                            <img
                                src={connection.fromUserId.photoURL}
                                className='w-14 h-14 rounded-full object-cover'
                                alt='User'
                            />
                            <div className='flex flex-col justify-center'>
                                <h2 className='font-semibold text-lg'>{connection.fromUserId.firstName + ' ' + connection.fromUserId.lastName}</h2>
                                <h2 className='text-sm text-gray-600'>{connection.fromUserId.gender}</h2>
                                <h2 className='text-sm text-gray-600'>{connection.fromUserId.about}</h2>
                            </div>
                            <div className="card-actions justify-end">
                                <button className="btn btn-secondary" onClick={() => handleRequest(connection, "rejected")}>Ignore</button>
                                <button className="btn btn-primary" onClick={() => handleRequest(connection, "accepted")}>Accept</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    )
}

export default Request