import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice"
import feedSlice from "./feedSlice"
import ConnectionSlice from "./connectionSlice"
const appStore = configureStore({
    reducer: {
        userSlice: userSlice,
        feedSlice: feedSlice,
        connectionSlice: ConnectionSlice
    }
})
export default appStore