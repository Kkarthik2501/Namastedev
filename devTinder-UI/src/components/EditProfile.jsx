import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'
import { addUser, UpdateProfile } from '../utils/userSlice'

const EditProfile = () => {


    const store = useSelector((store) => store.userSlice)
    const [firstName, setFirstName] = useState(store?.user?.data?.firstName || '')
    const [lastName, setLastName] = useState(store?.user?.data?.lastName || '')
    const [age, setAge] = useState(store?.user?.data?.age || '')
    const [gender, setGender] = useState(store?.user?.data?.gender || '')
    const [about, setAbout] = useState(store?.user?.data?.about || '')
    const [photoURL, setPhotoURL] = useState(store?.user?.data?.photoURL || '')
    const dispatch = useDispatch()
    const [showToast, setShowToast] = useState(false)
    useEffect(() => {

        if (store?.user?.age) {
            setAge(store?.user?.age)
        }
        if (store?.user?.about) {
            setAbout(store?.user?.about)
        }
        if (store?.user?.firstName) {
            setFirstName(store?.user?.firstName)
        }
        if (store?.user?.lastName) {
            setLastName(store?.user?.lastName)
        }
        if (store?.user?.gender) {
            setGender(store?.user?.gender)
        }
        if (store?.user?.photoURL) {
            setPhotoURL(store?.user?.photoURL)
        }

    }, [store])
    const SaveProfile = async () => {
        try {
            const res = await dispatch(UpdateProfile({ firstName, lastName, age, about, gender, photoURL }))
            // setShowToast(true)
            // setTimeout(() => {
            //     setShowToast(false)
            // }, 3000)
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div className='flex justify-center mt-15'>
                <div className="card bg-base-300 w-96 shadow-sm mx-2">
                    <div className="card-body">
                        <h2 className="card-title">Edit Profile</h2>
                        <div>
                            <label className="input validator mb-3">
                                <input type="text" placeholder='FirstName' required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </label>
                            <label className="input validator mb-3">
                                <input type="text" placeholder='LastName' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </label>
                            <label className="input validator mb-3">
                                <input type="number" placeholder='Age' value={age} onChange={(e) => setAge(e.target.value)} />
                            </label>
                            <label className="input validator mb-3">
                                <input type="text" placeholder='Gender' value={gender} onChange={(e) => setGender(e.target.value)} />
                            </label>
                            <label className="input validator mb-3">
                                <input type="text" placeholder='About' value={about} onChange={(e) => setAbout(e.target.value)} />
                            </label>
                            <label className="input validator mb-3">
                                <input type="text" placeholder='PhotoURL' value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} />
                            </label>
                        </div>
                        <div className="card-actions justify-center">
                            <button className="btn btn-primary" onClick={SaveProfile}>Save Profile</button>
                        </div>
                    </div>
                </div>
                < div className="card bg-base-300 mx-2 w-96 shadow-2xl " >
                    <figure>
                        <img
                            src={photoURL}
                            alt="No User Image" />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">{firstName + ' ' + lastName}</h2>
                        <p>{about ? about : ''}</p>
                        {/* <div className="card-actions justify-end">
                            <button className="btn btn-secondary">Ignore</button>
                            <button className="btn btn-primary">Send Request</button>
                        </div> */}
                    </div>
                </div >
            </div>
            {/* {showToast &&
                <div className="toast toast-top toast-center">
                    <div className="alert alert-success">
                        <span>Profile Saved successfully.</span>
                    </div>
                </div>} */}
        </>
    )
}


export default EditProfile