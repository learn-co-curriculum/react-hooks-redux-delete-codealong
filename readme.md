Deleting Items with Redux
==============

With this lesson we'll continue through our journey through Redux. By the end of this lesson, you will be able to:

  * Delete individual elements

## Review and Goal

Throughout each code along and lab in this section, notice that we are never updating the DOM directly. Instead, we use the Redux pattern to have our store hold and update our state, and we then have React display that state. We want to continue with this pattern here.  

So our goal is to have a button next to each list element with the todo; such that when a user clicks on that button, the list element will be removed.  In implementing this, remember that the `Todos` component displays the current list of todos, if we remove a todo from the store's state, the display of that todo should be removed.

## Deleting A Todo

To delete a todo we should add a button that when clicked, dispatches an action telling the store to delete a specific todo. How we tell the store which todo to delete, we'll figure out at the end. For now let's add in the button, and have it call a method that dispatches a delete action when clicked.  

Ok, so change the todo such that the body of the component looks like the following.

```javascript
// ./src/components/todos/Todo.js 
import React, { Component } from 'react';

class Todo extends Component {

  handleOnClick = () => {
    this.props.store.dispatch({
      type: 'DELETE_TODO'
    });
  }

  render() {
    return (
      <li>
        {this.props.text}
        <button onClick={this.handleOnClick} />
      </li>
    );
  }
};

export default Todo
```


So you can see that when we click on button, it calls a callback function `handleOnClick()` that then dispatches an action. Now we don't get access to the store automatically, we have to pass it through from the parent component so let's do that.  

Update the render function of the Todos component to look like the following: 

```javascript
// ./src/components/todos/Todos.js	...

import React, { Component } from 'react';
import Todo from './Todo';

class Todos extends Component {

  render() {

    const todos = this.props.store.getState().todos.map((todo, index) => {
      return <Todo text={todo.text} key={index} store={this.props.store} /* <- code change */ /> 
    });

    return(
      <ul>
        {todos}
      </ul>
    );
  }
};

export default Todos;
```

Ok, now we have the ability to dispatch an action to the store from each Todo. If you click on the button at this point, and open your console, you can see that it is properly dispatching an action each time it is clicked. 

## Tell the store which todo to delete

Now, currently our action says to delete a Todo, but it does not say which one to delete.  Ok, so we have a couple of problems right now.  First, we don't have a good way of identifying a particular Todo. We would like to identify them by an id. Second, we then need to tell each Todo component which Todo it is associated with. Finally, when a user clicks on the delete button, we need to send the Todo's id in the action. Let's implement these in turn.

#### Give each Todo an id

An Todo should have an id the moment it gets created. So, we know that our reducer creates the Todo when a CREATE_TODO action is dispatched. Let's update the code in there so that it also adds an id.

```javascript
// ./src/reducers/manageTodo.js

let id = 0;

export default function manageTodo(state = {
  todos: []
}, action) {
  switch (action.type) {
    case 'ADD_TODO':
      id++;
      const todo = Object.assign({}, action.todo, { id: id });
      return { todos: state.todos.concat(todo) };
    default:
      return state;
  }
}
```

Ok, so essentially we implement a counter. We initialize a variable id at the top of the file.  Because we are using modules, this variable, while not enclosed in a function, is local to the file. Then each time the `ADD_TODO` action is dispatched, we create a new object by combining the `action.todo` of `{ text: 'our todo text'}` and another JavaScript object simply with the id. Now, let's go to the React app, open the console, and add some todos. You will see, by inspecting the state, that the code is appropriately giving each Todo its own unique id.

#### Pass this id as a property to each Todo component

Go back to the file `./src/components/todos/Todos.js`. Now inside our map function, we need to not only pass through the text of each Todo as a prop, but also the id as a prop. So we need to change our `render()` function to include the following.
	
```javascript
// ./src/components/todos/Todos.js

import React, { Component } from 'react';
import Todo from './Todo';

class Todos extends Component {

  render() {

    const todos = this.props.store.getState().todos.map((todo, index) => {
      return <Todo text={todo.text} key={index} id={todo.id} /* <- code change */ store={this.props.store} /> 
    });

    return (
      <ul>
        {todos}
      </ul>
    );
  }
};

export default Todos;
```

Ok, so now inside of each Todo component, it will have a property of id with the correctly associated id. Now from inside that Todo component, we can change our dispatch action to state precisely which Todo we will be deleting. To implement this, we simply need to make one change to our `handleOnClick()` function in the `Todo` component. 

```javascript
// ./src/components/todos/Todo.js

...

handleOnClick() {
  this.props.store.dispatch({
    type: 'DELETE_TODO',
    id: this.props.id,
  });
}

...
```

Because each component has the correct id as a prop, we simply need to send this along as a payload to our dispatched action.  
	
3. Have our reducer change our state

Now that we are dispatching this action to a reducer, we need to tell our reducer how to make the appropriate modifications to our state. Essentially, when someone dispatches an action of type `DELETE_TODO`, along with the id of the todo we are deleting, we need to replace of our previous list of todos with a list that has each todos except the one in the actions id field.

Ok, let's take advantage of the filter method, and add the following line code to our `manageTodo` reducer.

```javascript 

// ./src/reducers/manageTodo.js	

let id = 0;

export default function manageTodo(state = {
  todos: []
}, action) {
  switch (action.type) {
    case 'ADD_TODO':
      id++;
      const todo = Object.assign({}, action.todo, { id: id });
      return { todos: state.todos.concat(todo) };
    case 'DELETE_TODO':
      const todos = state.todos.filter(todo => todo.id !== action.id);
      return  { todos }
    default:
      return state;
  }
};

```
	
So when the `DELETE_TODO` action is sent, we use the filter method to return all of the existing todos except the one with the id sent in the action. The filter method returns to us a new array, which we then return.

Now add some todos, click on the a couple delete buttons, and there they are gone.  	
	
## Summary

Ok, so in this lesson we covered how to delete a specific Todo. To implement this, we first gave each Todo a unique id, and then made sure we passed that id into each Todo component. Then we made sure to send along that information when dispatching an action. Finally, we had our reducer update the state by filtering out the Todo to be deleted.

