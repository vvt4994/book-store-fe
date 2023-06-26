import { createSlice } from '@reduxjs/toolkit'
import { message } from 'antd'

const initialState = {
  // sample state
  // carts: [
  //   {
  //     quantity: 1,
  //     _id: 'abc',
  //     detail: {
  //       _id: 'abc',
  //       name: 'product',
  //     },
  //   },
  // ],

  products: [],
}

export const cartsSlice = createSlice({
  name: 'carts',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    doAddToCart: (state, action) => {
      // check if product is in redux or not
      const productsArray = state.products
      const product = action.payload

      // findIndex: return index if condition meets
      // -1: not found
      let productIndex = productsArray.findIndex(
        (item) => item._id === product._id
      )

      // if product exists, update. If not, push in the redux
      if (productIndex > -1) {
        // check if quantity is reached limit, return maximum quantity
        const totalQuantityOrder =
          productsArray[productIndex].quantity + product.quantity
        const availableQuantity = product.detail.quantity - product.detail.sold

        if (totalQuantityOrder >= availableQuantity) {
          productsArray[productIndex].quantity = availableQuantity
        } else {
          productsArray[productIndex].quantity = totalQuantityOrder
        }
      } else {
        productsArray.push(product)
      }

      // update redux
      state.products = productsArray
    },

    doUpdateToCart: (state, action) => {
      state.products = action.payload

      message.success('Update product successfully!')
    },

    doDeleteToCart: (state, action) => {
      let productsUpdate = state.products.filter(
        (product) => product._id !== action.payload._id
      )

      state.products = productsUpdate

      message.success('Delete product successfully!')
    },

    doResetCart: (state, action) => {
      state.products = []
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {},
})

export const { doAddToCart, doUpdateToCart, doDeleteToCart, doResetCart } =
  cartsSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default cartsSlice.reducer
