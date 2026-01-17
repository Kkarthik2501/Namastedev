import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addUser, loginUser, signUpUser } from '../utils/userSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const store = useSelector((state) => state.userSlice)
    const navigate = useNavigate()
    const [islogin, setisLogin] = useState(true)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const handleLogin = async () => {
        try {
            if (islogin) {
                await dispatch(loginUser({ email, password }));

            }
            else {
                const res = await dispatch(signUpUser({ firstName, lastName, emailId: email, password }));
                if (res?.status != 200) {
                    toast.error(res.payload?.response?.data?.error || 'Signup failed');
                }
            }
            if (store.user != null) {

                navigate('/feed')
            }
            else {

                navigate('/login')
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='flex justify-center mt-15'>
            <div className="card bg-base-300 w-96 shadow-sm">
                <div className="card-body">
                    <h2 className="card-title">{islogin ? 'Login' : 'Signup'}</h2>
                    <div>
                        {!islogin &&
                            <>
                                <label className="input validator mb-3">
                                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
                                    <input type="text" placeholder="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />

                                </label>
                                <label className="input validator mb-3">
                                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
                                    <input type="text" placeholder="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </label></>}
                        <label className="input validator mb-3">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
                            <input type="email" placeholder="mail@site.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        {/* <div className="validator-hint hidden">Enter valid email address</div> */}
                        <label className="input validator">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g></svg>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" minlength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
                        </label>

                    </div>
                    <div className="card-actions justify-center">
                        <button className="btn btn-primary" onClick={handleLogin}>{islogin ? 'Login' : 'SignUp'}</button>
                    </div>
                    {islogin ? <span className="text-center my-1 cursor-pointer" onClick={() => setisLogin(false)}>New User ? SignUp</span> : <span className="text-center my-1 cursor-pointer" onClick={() => setisLogin(true)}>Already an existing user</span>}
                </div>
            </div>
        </div>
    )
}

export default Login