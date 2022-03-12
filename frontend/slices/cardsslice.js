import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  offset: 0,
};

export const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    increaseOffset: state => {
      state.offset += 10;
    },
    resetOffset: state => {
      state.offset = 0;
    },
  },
});

export const { increaseOffset, resetOffset } = cardsSlice.actions;

//selectors
export const getOffset = state => state.cards.offset;

export default cardsSlice.reducer;
