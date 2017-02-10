let id = 0;

export default function manageTodo(state = {
  todos: []
}, action) {
  switch (action.type) {
    case 'ADD_TODO':
      const todo = Object.assign({}, action.todo, { id: id });
       id++;
      return { todos: state.todos.concat(todo) };
    default:
      return state;
  }
};
