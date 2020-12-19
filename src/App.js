import React from "react";
import CreateTodo from "./features/todos/CreateTodo";
import TodoContainer from "./features/todos/TodoContainer";

function App() {
  return (
    <div className="App">
      <CreateTodo />
      <TodoContainer />
    </div>
  );
}

export default App;
