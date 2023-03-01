import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../axios"
import { createSelector } from 'reselect'
import { shallowEqual } from "react-redux"

export const productSearch = createAsyncThunk('product/search', async (args, { getState }) => {
    const { searchTerm } = getState().product
    const response = await axiosInstance.post('product/search', { search: searchTerm })
    const data = await response.data
    let availableData = []
    return data;
})
// export const allProduct = createAsyncThunk('product/search', async (args, { getState }) => {
//     const { searchTerm } = getState().product
//     const response = await axiosInstance.post('product/search', { search: searchTerm })
//     const data = await response.data

//     console.log(data)

//     return data
// })

export const fecthProducts = createAsyncThunk('product/fetchProducts', async (args, thunkAPI) => {
    const response = await (await axiosInstance.get('product')).data.data
    const data = await response.data
    return data
})
const searchResult = state => state.product.searchResult
const categoryFilter = state => state.product.categoryFilter
export const selectFilteredProducts = createSelector(
    searchResult,
    categoryFilter,
    (products, filters) => filters.length === 0 ? products : products.filter((_product) => filters.indexOf(_product.category) >= 0),
    {
        memoizeOptions: {
            resultEqualityCheck: shallowEqual
        }
    }
)


export const productSlice = createSlice({
    name: 'product',
    initialState: {
        searchTerm: "",
        searchResult: [],
        categoryFilter: [],
        status: 'idle',
        error: null
    },
    reducers: {
        setSearchTerm(state, action) {
            state.searchTerm = action.payload
        },
        addFilter(state, action) {
            state.categoryFilter.push(action.payload)
        },
        removeFilter(state, action) {
            if (state.categoryFilter.indexOf(action.payload) >= 0) {
                state.categoryFilter.splice(state.categoryFilter.indexOf(action.payload), 1)
            }
        },
        toggleFilter(state, action) {
            if (state.categoryFilter.includes(action.payload)){
                state.categoryFilter.splice(state.categoryFilter.indexOf(action.payload), 1)
            } else{
                state.categoryFilter.push(action.payload)
            }
        }
    },
    
    extraReducers: {
        [productSearch.pending]: (state, action) => {
            state.status = 'loading'
        },
        [productSearch.fulfilled]: (state, action) => {
            state.status = 'success'
            state.searchResult = action.payload
        },
        [productSearch.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message;
        }
    }
})

export const getProductSearchResults = (state) => state.product.searchResult;
export default productSlice.reducer