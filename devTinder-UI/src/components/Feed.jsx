import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFeedData, addFeed } from '../utils/feedSlice'
import UserCard from './UserCard'

const Feed = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const getFeed = async () => {
            console.log("Fetching feed data")
            const res = await dispatch(getFeedData())
            // await dispatch(addFeed(res.payload))
        }
        getFeed();
    }, [])
    return (

        <div className="flex justify-center mx-10"><UserCard /></div>
    )
}

export default Feed