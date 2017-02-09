import React, { Component } from 'react';

class CreateTodo extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      text: '',
    };
  }

  handleOnChange(event) {
    this.setState({
      text: event.target.value,
    });
  }

  handleOnSubmit(event) {
    event.preventDefault();
    this.props.store.dispatch({
      type: 'ADD_TODO', 
      todo: this.state,
    });
    this.setState({
      text: '',
    });
  }

  render() {
    return(
      <div>
        <form onSubmit={(event) => this.handleOnSubmit(event)}>
          <p>
            <label>add todo</label>
            <input 
              type="text" 
              value={this.state.text} 
              onChange={(event) => this.handleOnChange(event)}/>
          </p>
          <input type="submit" />
        </form>
      </div>
    );
  }
};

export default CreateTodo;
