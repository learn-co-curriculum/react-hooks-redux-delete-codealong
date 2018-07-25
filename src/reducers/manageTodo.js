export default function manageTodo(state = {
  todos: [],
}, action) {
  console.log(action);
  switch (action.type) {
    case 'ADD_TODO':

      const todo = {
        id: Math.random()*10000000000000000,
        text: action.payload.text
      }
      return { todos: state.todos.concat(todo) };

    case 'DELETE_TODO':

      return {todos: state.todos.filter(todo => todo.id !== action.payload)}

    default:
      return state;
  }
}
