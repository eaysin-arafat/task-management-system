import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "./boardsSlice";

const store = configureStore({
  reducer: {
    boards: boardSlice.reducer,
  },
});

export default store;
