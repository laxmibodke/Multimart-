import { createSlice } from "@reduxjs/toolkit";

// Recupero lista prodotti dal localStorage o inizializzazione a lista vuota
const storedCartList =
  localStorage.getItem("cartList") !== null
    ? JSON.parse(localStorage.getItem("cartList"))
    : [];

// Stato iniziale del carrello con lista prodotti recuperata
const initialState = {
  cartList: storedCartList,
};

// Creazione di uno slice Redux per la gestione del carrello
export const cartSlice = createSlice({
  name: "cart", // Nome dello slice
  initialState, // Stato iniziale
  reducers: {
    // Aggiunge un prodotto al carrello
    addToCart: (state, action) => {
      const { product, num } = action.payload;
      const productExit = state.cartList.find(item => item.id === product.id);

      if (productExit) {
        productExit.qty += num; // Directly mutate the existing product's qty
      } else {
        state.cartList.push({ ...product, qty: num });
      }
    },
    // Diminuisce la quantità di un prodotto
    decreaseQty: (state, action) => {
      const productToDecreaseQnty = action.payload;
      const productExit = state.cartList.find(item => item.id === productToDecreaseQnty.id);

      if (productExit) {
        if (productExit.qty > 1) {
          productExit.qty -= 1; // Decrease quantity directly
        } else {
          state.cartList = state.cartList.filter(item => item.id !== productExit.id); // Remove if qty is 1
        }
      }
    },
    // Elimina completamente un prodotto dal carrello
    deleteProduct: (state, action) => {
      const productToDelete = action.payload;
      state.cartList = state.cartList.filter(item => item.id !== productToDelete.id);
    },
  },
});

// Middleware per salvare il carrello nel localStorage dopo ogni modifica
export const cartMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  // Se l'azione riguarda il carrello, aggiorna il localStorage
  if (action.type?.startsWith("cart/")) {
    const cartList = store.getState().cart.cartList;
    localStorage.setItem("cartList", JSON.stringify(cartList));
  }
  return result;
};

// Esportazione delle azioni per l'uso nel componente
export const { addToCart, decreaseQty, deleteProduct } = cartSlice.actions;

// Esportazione del reducer del carrello
export default cartSlice.reducer;
