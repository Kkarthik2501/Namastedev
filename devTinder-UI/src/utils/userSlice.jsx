import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";
import { BASE_URL } from "./constants";
import { toast } from "react-toastify";
const initialState = {
    user: null,
    loading: true
}
export const signUpUser = createAsyncThunk(
    'userSlice/signUpUser',
    async (user, thunkAPI) => {
        try {
            const resposne = await axios.post(BASE_URL + '/signup', user, { withCredentials: true })
            return resposne.data;
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)
export const loginUser = createAsyncThunk(
    'userSlice/loginUser',
    async (user, thunkAPI) => {
        try {
            const res = await axios.post(BASE_URL + '/login', { emailId: user.email, password: user.password },
                { withCredentials: true } // this will set cookie in  broswer , this should be done to send the token while making api calls , 
                // token wil be taken from cookie and will be snet to api call
            )
            return res.data
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)
export const logoutUser = createAsyncThunk(
    'userSlice/logoutUser',
    async (user, thunkAPI) => {
        try {
            const response = await axios.get(BASE_URL + '/logout', { withCredentials: true })
            return response.data
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)
export const fetchUser = createAsyncThunk(
    'userSlice/fetchUser',
    async (user, thunkAPI) => {
        try {
            const response = await axios.get(BASE_URL + '/profile/view', { withCredentials: true })
            return response.data;
        }
        catch (err) {
            // return thunkAPI.rejectWithValue(err.response?.status)
            return thunkAPI.rejectWithValue({
                status: err.response?.status,
                message: err.response?.data?.message || 'Unknown error'
            });
        }
    }
)
export const UpdateProfile = createAsyncThunk(
    'userSlice/updateProfile',
    async (user, thunkAPI) => {
        try {
            const response = await axios.patch(BASE_URL + '/profile/edit', user, { withCredentials: true })
            return response.data
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err.response)
        }
    }
)
const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload.data.data
        },
        removeUser: (state, action) => {
            state.user = null
        }
    },
    extraReducers: (builder) => {
        builder.
            addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload
                toast.success("Login successful")

            })
            .addCase(loginUser.rejected, (state, action) => {
                toast.error("Please enter valid email id and password")
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.user = action.payload
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false
                state.user = null
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload
                state.loading = false
            })
            .addCase(fetchUser.pending, (state, action) => {
                state.loading = true
            })
            .addCase(UpdateProfile.fulfilled, (state, action) => {
                state.user = action.payload
                toast.success(action.payload.message || 'Profile updated successfully')
            })
    }
})
export const { addUser, removeUser } = userSlice.actions
export default userSlice.reducer 