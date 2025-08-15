import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { BASE_URL } from "./constants"


const initialState = {
    connections: [],
    requestReceived: []
}
export const getConnections = createAsyncThunk(
    'connectionSlice/getConnections',
    async (user, thunkAPI) => {
        try {
            const response = await axios.get(BASE_URL + "/user/requests", { withCredentials: true })
            return response.data
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)
export const requestReceived = createAsyncThunk(
    'connectionSlice/requestReceived',
    async (user, thunkAPI) => {
        try {
            const response = await axios.get(BASE_URL + "/user/requests/received", { withCredentials: true })
            return response.data;
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)
export const AcceptIgnoreRequest = createAsyncThunk(
    'connectionSlice/AcceptIgnoreRequest',
    async (request, thunkAPI) => {
        try {
            const response = await axios.post(BASE_URL + "/request/review/" + request.status + "/" + request.connection._id, {}, { withCredentials: true })
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)
export const SendConnectionRequest = createAsyncThunk(
    'connectionSlice/SendConnectionRequest',
    async (feed, thunkAPI) => {
        try {
            const response = await axios.post(BASE_URL + "/request/send/" + feed.status + "/" + feed.feed._id, {}, { withCredentials: true });
            return response.data;
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)
const ConnectionSlice = createSlice({
    name: "ConnectionSlice",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getConnections.fulfilled, (state, action) => {
            state.connections = action.payload
        })
            .addCase(getConnections.rejected, (state, action) => {
                state.connections = []
            })
            .addCase(requestReceived.fulfilled, (state, action) => {
                state.requestReceived = action.payload
            })
            .addCase(AcceptIgnoreRequest.fulfilled, (state, action) => {

            })
    }
})
export default ConnectionSlice.reducer
