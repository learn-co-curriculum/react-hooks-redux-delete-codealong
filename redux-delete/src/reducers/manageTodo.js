let id = 0
export default function manageTodo(state = {todos: []}, action){
  switch (action.type) {
    case 'ADD_TODO':
    id++
    let todo = Object.assign({}, action.payload, {id: id})
      return {todos: state.todos.concat(todo)}
    default:
      return state;
  }
}
