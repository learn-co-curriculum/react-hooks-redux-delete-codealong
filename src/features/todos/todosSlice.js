import { createSlice } from "@reduxjs/toolkit";

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    entities: [], // array of todos
  },
  reducers: {
    todoAdded(state, action) {
      state.entities.push(action.payload);
    },
  },
});

export const { todoAdded } = todosSlice.actions;

export default todosSlice.reducer;
