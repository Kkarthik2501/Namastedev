import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { getConnections } from '../utils/connectionSlice'

const Connections = () => {
    const dispatch = useDispatch()
    const connections = useSelector((store) => store.connectionSlice.connections.data)
    const fetchData = async () => {
        await dispatch(getConnections())
    }
    useEffect(() => {
        fetchData()
    }, [])
    if (!connections || connections.length === 0) {
        return <h2 className='text-center text-2xl'>No Existing Connections</h2>
    }
    return (
        <div>
            <h2 className='text-center text-2xl'> Connections</h2>
            <div className='flex justify-center'>
                <div className='flex flex-col gap-4 w-full max-w-sm'>
                    {connections.map((connection) => (
                        <div key={connection._id} className='flex gap-3 my-3 border rounded-3xl border-amber-50 items-center p-3 shadow-md'>
                            <img
                                src={connection.photoURL}
                                className='w-14 h-14 rounded-full object-cover'
                                alt='User'
                            />
                            <div className='flex flex-col justify-center'>
                                <h2 className='font-semibold text-lg'>{connection.firstName + ' ' + connection.lastName}</h2>
                                <h2 className='text-sm text-gray-600'>{connection.gender}</h2>
                                <h2 className='text-sm text-gray-600'>{connection.about}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Connections