import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../axios";
import { createSelector } from "reselect";
import { shallowEqual } from "react-redux";

export const createNotification = createAsyncThunk('notification/createNotification', async (args, thunkAPI) => {
    const response = await axiosInstance.post('notification', args)
    const data = response.data
    return data
})

export const updateNotification = createAsyncThunk('notification/updateNotification', async (args, thunkAPI) => {
    const response = await axiosInstance.patch(`notification/${args.id}`, args)
    const data = response.data
    return data
})

export const fetchNotification = createAsyncThunk('notification/fetchNotification', async (args, thunkAPI) => {
    const data = (await axiosInstance.get('notification')).data
    return data
})



export const _allNotification = state => state.notification.allNotification

export const unreadNotificationSelector = createSelector(
    _allNotification,
    (notifications) => notifications && notifications.length > 0 ? notifications.filter(notification => notification.readStatus === false) : [],
    {
        memoizeOptions: {
            resultEqualityCheck: shallowEqual
        }
    }
)


export const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        allNotification: [],
    },
    reducers: {
        addNotification(state, action){
            state.allNotification.push(action.payload)
        },
    },

    extraReducers: {
        [fetchNotification.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchNotification.fulfilled]: (state, action) => {
            state.status = 'success'
            state.allNotification = action.payload
        },
        [fetchNotification.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message;
        },

        
        [createNotification.pending]: (state, action) => {
            state.status = 'loading'
        },
        [createNotification.fulfilled]: (state, action) => {
            state.status = 'success'
            // state.allNotification.push(action.payload)
        },
        [createNotification.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message;
        },

        [updateNotification.pending]: (state, action) => {
            state.status = 'loading'
        },
        [updateNotification.fulfilled]: (state, action) => {
            state.status = 'success'
            const index = state.allNotification.findIndex(notification => notification.id ===action.payload.id)
            state.allNotification.splice(index, 1, action.payload)
        },
        [updateNotification.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message;
        },
    }
})
