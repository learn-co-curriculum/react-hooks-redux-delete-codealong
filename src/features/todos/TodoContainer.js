import React from "react";
import { useSelector } from "react-redux";
import Todo from "./Todo";

function TodoContainer() {
  const todos = useSelector((state) => state.todos.entities);

  const todoList = todos.map((todo, index) => <Todo key={index} todo={todo} />);
  return <ul>{todoList}</ul>;
}

export default TodoContainer;
