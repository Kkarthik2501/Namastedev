import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";
import { BASE_URL } from "./constants";
const initialState = {
    feed: []
}
export const getFeedData = createAsyncThunk(
    'feedSlice/getFeedData',
    async (user, thunkAPI) => {
        try {
            console.log("in fetching feed dispatch")
            const response = await axios.get(BASE_URL + '/user/feed', { withCredentials: true })
            return response.data
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)
const feedSlice = createSlice({
    name: 'feedSlice',
    initialState,
    reducers: {
        getFeed: (state, action) => {
            state.feed = action.payload
        },
        addFeed: (state, action) => {
            state.feed = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getFeedData.fulfilled, (state, action) => {
            state.feed = action.payload
        })
            .addCase(getFeedData.rejected, (state, action) => {
                state.feed = []
            })
    }
})
export default feedSlice.reducer;
export const { getFeed, addFeed } = feedSlice.actions
