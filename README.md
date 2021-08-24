# Deleting Items with Redux

## Objectives

With this lesson we will continue through our journey through Redux. By the end of
this lesson, you will be able to:

- Delete individual elements

## Review and Goal

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

## Modifying our Todo

We'll be adding a delete button and dispatching an action to remove the todo
from our Redux store when that button is clicked. Since we're using
`react-redux`, we can use the dispatch function anywhere we like. To avoid
passing props unnecessarily, let's write the dispatch logic directly in the
`Todo` component.

First, let's update our component to include a delete button:

```jsx
// ./src/features/todos/Todo.js
import React from "react";
import { useDispatch } from "react-redux";

import React from "react";

function Todo({ text }) {
  const dispatch = useDispatch();

  return (
    <li>
      <span>{text}</span>
      <button>DELETE</button>
    </li>
  );
}

export default Todo;
```

When we click the button we want to be able to delete this particular todo. At
the moment, our todos are just strings, stored in an array. Since that is all we
have to work with, we add an `onClick` attribute to the new button, and a click
handler:

```jsx
function Todo({ text }) {
  const dispatch = useDispatch();

  function handleDeleteClick() {
    // TODO: dispatch an action
  }

  return (
    <li>
      <span>{text}</span>
      <button onClick={handleDeleteClick}>DELETE</button>
    </li>
  );
}
```

Ok, now we have the ability to dispatch an action to the reducer from each Todo!

## Tell the Store Which Todo to Delete

Our todos are stored as strings in an array. We'll add a `todoRemoved` action to
the reducer. Since we're working with `createSlice`, we can use a _destructive_
operation on the array, such as `splice`, to remove the todo using its index:

```js
const todosSlice = createSlice({
  name: "todos",
  initialState: {
    entities: [], // array of todos
  },
  reducers: {
    todoAdded(state, action) {
      state.entities.push(action.payload);
    },
    todoRemoved(state, action) {
      const index = state.entities.findIndex((todo) => todo === action.payload);
      state.entities.splice(index, 1);
    },
  },
});

export const { todoAdded, todoRemoved } = todosSlice.actions;
```

After exporting our new action, we can use it in the `Todo` component to
dispatch the "delete" action:

```jsx
import { todoRemoved } from "./todosSlice";

function Todo({ text }) {
  const dispatch = useDispatch();

  function handleDeleteClick() {
    dispatch(todoRemoved(text));
  }

  return (
    <li>
      <span>{text}</span>
      <button onClick={handleDeleteClick}>DELETE</button>
    </li>
  );
}
```

In our browser, the delete button should now successfully cause todos to
disappear!

There is a problem though. What if you have multiple todos with the same text?
With this set up, every todo that matches `action.payload` will be filtered out.

To get around this, instead of filtering just text, it would be better if we
gave our Todos specific IDs.

## Give each Todo an id

A Todo should have an id the moment it gets created. So, we know that our
reducer creates the Todo when a `"todos/todosAdded"` action is dispatched. Let's
update the code in there so that it also adds an id.

```js
import { v4 as uuid } from "uuid";

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    entities: [],
  },
  reducers: {
    todoAdded(state, action) {
      state.entities.push({
        id: uuid(), // use the uuid function to generate a unique id
        text: action.payload,
      });
    },
    todoRemoved(state, action) {
      const index = state.entities.findIndex((todo) => todo === action.payload);
      state.entities.splice(index, 1);
    },
  },
});
```

Using `uuid()` will generate a long random string each time a todo is created.
Now, instead of just storing an array of strings in our store, we'll be storing
an array of objects.

This causes a problem 'downstream', though: we need to update our `TodosContainer`
to pass the correct content.

## Update TodosContainer

In `TodosContainer`, our `todoList` variable will need to change a little:

```jsx
const todoList = todos.map((todo) => <Todo key={index.id} todo={todo} />);
```

The change is minimal, but this set up is actually better. Previously, `key` was
based off the _index_ provided by `map`. Now its using our randomly generated
ID, and is less prone to errors in the virtual DOM. We'll need both `todo.id`
and `todo.text` to be passed into Todo so we pass both down as the object,
`todo`.

## Update the Todo Component

Now that we've got `todo.id`, we can modify the `Todo` component to use `todo.id`
on click:

```jsx
function Todo({ todo }) {
  const dispatch = useDispatch();

  function handleDeleteClick() {
    dispatch(todoRemoved(todo.id));
  }

  return (
    <li>
      <span>{todo.text}</span>
      <button onClick={handleDeleteClick}>DELETE</button>
    </li>
  );
}
```

Now, when `dispatch` is called, an action is dispatched that contains an
_id_ only as its payload.

## Updating `todoRemoved` in the Reducer

Now that we're passing an _id_ in the action payload, we need to modify our reducer
once more:

```js
todoRemoved(state, action) {
  const index = state.entities.findIndex((todo) => todo.id === action.payload);
  state.entities.splice(index, 1);
},
```

Instead of comparing `todo` with `action.payload`, now that `todo` is an object,
we want to match `todo.id` with the payload.

With this final change, todo objects can be added and deleted, each with their
own unique id!

## Summary

In this lesson we covered how to delete a specific Todo. To implement this, we
gave each Todo a unique id, and then made sure we passed that id into each Todo
component. Then we made sure to send along that information when dispatching an
action via `props.delete`. Finally, we had our reducer update the state by
filtering out the Todo to be deleted.
