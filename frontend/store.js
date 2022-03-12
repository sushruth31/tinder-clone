import { configureStore } from "@reduxjs/toolkit";
import cardsSlice from "./slices/cardsslice";
import userSlice from "./slices/userslice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    cards: cardsSlice,
  },
});
