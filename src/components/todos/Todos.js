import React, { Component } from 'react'
import Todo from './Todo'

class Todos extends Component {

  render() {

    const todos = this.props.store.getState().todos.map((todo, index) => {
      return <Todo text={todo.text} key={index} id={todo.id} />
    });

    return(
      <ul>
        {todos}
      </ul>
    );
  }
};

export default Todos;
