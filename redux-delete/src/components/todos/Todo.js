import React, { Component } from 'react'

class Todo extends Component {
  handleClick(){
    
    this.props.store.dispatch({type: 'DELETE_TODO', payload: this.props.id})
  }
  render(){
    return (
      <li>
        {this.props.text}
        <button onClick={this.handleClick.bind(this)}>Delete </button>
      </li>
    )
  }
}

export default Todo
