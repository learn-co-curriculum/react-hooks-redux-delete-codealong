# Deleting Items with Redux

## Objectives

With this lesson we will continue through our journey through Redux. By the end of
this lesson, you will be able to:

  * Delete individual elements

## Review and Goal

Throughout each code along in this section, notice that we are never updating
the DOM directly. Instead, we use the Redux pattern to have our store hold and
update our state, and we then have React display that state. We want to continue
with this pattern here.  

Our goal this time is to have a button next to each list element with the todo;
such that when a user clicks on that button, the list element will be removed.
In implementing this, remember that the `Todos` component displays the current
list of todos, if we remove a todo from the store's state, the display of that
todo should be removed.

## Deleting A Todo

To delete a todo we should add a button that when clicked, dispatches an action
telling the store to delete a specific todo. How we tell the store which todo to
delete, we'll figure out at the end. For now let's add in the button, and have
it call a method that dispatches a delete action when clicked.  

#### Modifying our TodosContainer

Sticking with our container vs presentational set up, we don't want to load our
presentational Todo component up with logic. Meanwhile, TodosContainer is where
we're connected to __Redux__, so let's write in a new `mapDispatchToProps()` function
to include an action:


```javascript
// ./src/components/todos/TodosContainer.js
import React, { Component } from 'react';
import { connect } from 'react-redux'
import Todo from './Todo'

class TodosContainer extends Component {

  renderTodos = () => this.props.todos.map((todo, id) => <Todo key={id} text={todo} />)

  render() {
    return(
      <div>
        {this.renderTodos()}
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    todos: state.todos
  }
}

const mapDispatchToProps = dispatch => {
  return {
    delete: todoText => dispatch({type: 'DELETE_TODO', payload: todoText })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodosContainer);
```

Now, TodosContainer will have access to `this.props.delete`, which can take in
an argument and send it as the action's `payload`. We can then _pass_
`this.props.delete` down to Todo, so that each Todo component rendered will have
access to our 'DELETE_TODO' action.


```js
renderTodos = () => this.props.todos.map((todo, id) => <Todo delete={this.props.delete} key={id} text={todo} />)

```

#### Modifying the Todo Component

Todo is receiving `this.props.delete`, so let's update the component a little
and incorporate a button:

```js
import React from 'react'

const Todo = props => {
  return (
    <div>
      <span>{props.text}</span><button>DELETE</button>
    </div>
  )
}

export default Todo;
```

When we click the button we want to be able to delete this particular todo. At
the moment, our todos are just strings, stored in an array. Since that is all we
have to work with, we add an `onClick` attribute to the new button. To keep this
component small, we can provide an anonymous function in-line:

```js
<div>
  <span>{props.text}</span><button onClick={() => props.delete(props.text)}>DELETE</button>
</div>
```

So, what is happening here? We're providing a definition for an anonymous
function. _Inside_ the definition, we're calling `props.delete`, and passing in
the only other prop available, `props.text`.

Back in our connected TodosContainer, when this delete button is clicked, the
value of `props.text` is passed into our dispatched action as the payload.


There is a `console.log` in our reducer that displays actions. Clicking the
delete button should log an action with the todo's text content as the payload.

Ok, now we have the ability to dispatch an action to the reducer from each Todo!

## Tell the Store Which Todo to Delete

Our todos are stored as strings in an array. There are a number of ways to
remove a specific string from an array, but one of the more brief options is to
use `filter`. By adding a second case to our `manageTodo` reducer, we can write
a `filter` that returns every todo that _doesn't_ match what is contained in
`action.payload`:

```js
export default function manageTodo(state = {
  todos: [],
}, action) {
  console.log(action);
  switch (action.type) {
    case 'ADD_TODO':

      return { todos: state.todos.concat(action.payload.text) };

    case 'DELETE_TODO':

      return {todos: state.todos.filter(todo => todo !== action.payload)}

    default:
      return state;
  }
}
```

In our browser, the delete button should now successfully cause todos to
disappear!

There is a problem though. What if you have multiple todos with the same text?
With this set up, every todo that matches `action.payload` will be filtered out.

To get around this, instead of filtering just text, it would be better if we
gave our Todos specific IDs.

#### Give each Todo an id

A Todo should have an id the moment it gets created. So, we know that our
reducer creates the Todo when a CREATE_TODO action is dispatched. Let's update
the code in there so that it also adds an id.

```javascript
// ./src/reducers/manageTodo.js
import uuid from 'uuid';

export default function manageTodo(state = {
  todos: [],
}, action) {
  console.log(action);
  switch (action.type) {
    case 'ADD_TODO':

      const todo = {
        id: uuid(),
        text: action.payload.text
      }
      return { todos: state.todos.concat(todo) };

    case 'DELETE_TODO':

      return {todos: state.todos.filter(todo => todo !== action.payload)}

    default:
      return state;
  }
}
```

Using `uuid()` will generate a long random string each
time a todo is created. Now, instead of just storing an array of strings in our store, 
we'll be storing an array of objects.

This causes a problem 'downstream', though: we need to update our TodosContainer
to pass the correct content.

#### Update TodosContainer

In TodosContainer, our `renderTodos` method will need to change a little:

```js
renderTodos = () => {
  return this.props.todos.map(todo => <Todo delete={this.props.delete} key={todo.id} todo={todo} />)
}
```

The change is minimal, but this set up is actually better. Previously, `key` was
based off the _index_ provided by `map`. Now its using our randomly generated
ID, and is less prone to errors in the virtual DOM. We'll need both `todo.id`
and `todo.text` to be passed into Todo so we pass both down as the object,
`todo`.

#### Update the Todo Component

Now that we've got `todo.id`, we can modify the Todo component to use `props.todo.id`
on click:

```js
import React from 'react'

const Todo = props => {
  return (
    <div>
      <span>{props.todo.text}</span><button onClick={() => props.delete(props.todo.id)}>DELETE</button>
    </div>
  )
}

export default Todo;
```

Now, when `props.delete` is called, an action is dispatched that contains an
_id_ only as its payload.

#### Updating `DELETE_TODO` in the Reducer

Now that we're passing an _id_ to `props.delete`, we need to modify our reducer
once more:

```js
case 'DELETE_TODO':

  return {todos: state.todos.filter(todo => todo.id !== action.payload)}
```

Instead of comparing `todo` with `action.payload`, now that `todo` is an object,
we want to match `todo.id` with the payload.

With this final change, todo objects can be added and deleted, each with their
own unique id!

## Summary

Ok, so in this lesson we covered how to delete a specific Todo. To implement
this, we gave each Todo a unique id, and then made sure we passed that id into
each Todo component. Then we made sure to send along that information when
dispatching an action via `props.delete`. Finally, we had our reducer update the
state by filtering out the Todo to be deleted.

