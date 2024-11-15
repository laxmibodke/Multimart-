
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { addToCart, decreaseQty, deleteProduct } from './app/features/cart/cartSlice'; 
describe('Cart Slice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({ reducer: { cart: cartReducer } });
  });

  test('should initialize with an empty cart', () => {
    const state = store.getState().cart;
    expect(state.cartList).toEqual([]);
  });

  test('should add a product to the cart', () => {
    const product = { id: 1, name: 'Product 1' };
    store.dispatch(addToCart({ product, num: 1 }));

    const state = store.getState().cart;
    expect(state.cartList).toEqual([{ ...product, qty: 1 }]);
  });

  test('should increase quantity of an existing product in the cart', () => {
    const product = { id: 1, name: 'Product 1' };
    store.dispatch(addToCart({ product, num: 1 }));
    store.dispatch(addToCart({ product, num: 1 })); 

    const state = store.getState().cart;
    expect(state.cartList).toEqual([{ ...product, qty: 2 }]);
  });

  test('should decrease quantity of a product in the cart', () => {
    const product = { id: 1, name: 'Product 1' };
    store.dispatch(addToCart({ product, num: 2 }));
    store.dispatch(decreaseQty(product)); 

    const state = store.getState().cart;
    expect(state.cartList).toEqual([{ ...product, qty: 1 }]);
  });

  test('should remove a product from the cart when quantity reaches zero', () => {
    const product = { id: 1, name: 'Product 1' };
    store.dispatch(addToCart({ product, num: 1 })); 
    store.dispatch(decreaseQty(product)); 

    const state = store.getState().cart;
    expect(state.cartList).toEqual([]); 
  });

  test('should delete a product from the cart', () => {
    const product = { id: 1, name: 'Product 1' };
    store.dispatch(addToCart({ product, num: 1 })); 
    store.dispatch(deleteProduct(product)); 

    const state = store.getState().cart;
    expect(state.cartList).toEqual([]); 
  });
});
