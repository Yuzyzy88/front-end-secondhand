import { configureStore } from "@reduxjs/toolkit";
import productReducer from '../slices/ProductSlice';
import { notificationSlice } from '../slices/notificationSlice'

export default configureStore({
    reducer: {
        product: productReducer, 
        notification: notificationSlice.reducer
    },
    devTools: true
})