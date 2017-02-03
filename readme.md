Deleting Items with Redux
==============

With this lesson we'll continue through our journey through rest.  By the end of this lesson, you will be able to:

  * Delete individual elements

## Review and Goal

Throughout each code along and lab in this section, notice that we are never updating the dom directly.  Instead, we use the redux pattern to have our store hold and update our state, and we then have react display that state.  We want to continue with this pattern here.  

So our goal is to have a button next to each list element with the todo such that when a user clicks on that button, the list element will be removed.  In implementing this, remember that Todos component displays the current list of todos, if we remove a todo from the store's state, the display of that todo should be removed.

## Refactoring into a Todo Component 

Ok, so if you open the components/todos/Todos.js file you can see our react component rendering out the list of Todos.  Now, we are going to add a button next to each Todo, and when that button is deleted we will need to dispatch an action to the store.  It sounds like a good amount of behavior and visuals for each todo element, so let's create a Todo component.  Then, in our Todos component we will no longer have map return an array of li elements, but rather have it return an array of Todo components, and each Todo component will render the list element.  

That was a mouthful.  Let's make the changes.  

If you open up the code, you'll see that inside the src/components/todos folder, we added a new file Todo.js.  Inside it we have a Todo component that currenly just renders a div.  Remember we want it to instead render out the li element that currently lives inside the map function in the Todos component.  Let's move it to our todo component.

src/components/todos/Todo.js

	import React, { Component } from 'react'

	class Todo extends Component {
	  render(){
	    return (
	      <li>{this.props.text}</li>
	    )
	  }
	}

	export default Todo

Now we need to call that component from our map function in the Todos component.  And we need to tell each individual Todo about the text that it is rendering.  So we change our Todos component to the following.

	import React, { Component } from 'react'
	import Todo from './Todo' //changed line

	class Todos extends Component {
	  render(){
	    let todos = this.props.store.getState().todos.map(function(todo){
	      return <Todo text={todo.text} /> //changed line
	    })
	    return(
	      <ul>
	        {todos}
	      </ul>
	    )
	  }
	}
	
	export default Todos;
  
 Alright, we just gave each list element into its own component, and got our code back to working again.  Sounds like a good refactoring.  Now let's start giving our users the ability to delete.  

## Deleting A Todo

To delete a Todo we should add a button that when clicked, dispatches an action telling the store to delete a specific Todo.  How we tell the store which todo to delete, we'll figure out at the end.  For now let's add in the button, and have it call a method that dispatches a delete action when clicked.  

Ok, so change the todo such that the body of the component looks like the following.

	class Todo extends Component {
	  handleClick(){
	    this.props.store.dispatch({type: 'DELETE_TODO'})
	  }
	  render(){
	    return (
	      <li> {this.props.text}
	      <button onClick={this.handleClick.bind(this)}>Delete </button>
	      </li>
	    )
	  }
	}

So you can see that when we click on button, it calls a callback function handleClick that then dispatches an action.  Now we don't get access to the store automatically, we have to pass it through from the parent component so let's do that.  

Update the render function of the Todos component to look like the following: 

	...
	render(){
    let todos = this.props.store.getState().todos.map((todo) => {
      return <Todo text={todo.text} store={this.props.store} />
    })
    ...

> Why switch to the arrow function?
>
>We move to the using the arrow function as the callback to map because we are referencing this.  We want our context (this) to stay what it was outside of the callback function, the Todos component.  However, inside unless we use the arrow function syntax our context will switch to be the global state once we move into the callback.  To maintain our context, we use the arrow function.

Ok, now we have the ability to dispatch an action to the store from each Todo.  If you click on the button at this point, and open your console, you can see that it is properly dispatching an action each time it is clicked.  

## Tell the store which todo to delete

Now, currently our action says to delete a Todo, but it does not say which one to delete.  Ok, so we have a couple of problems right now.  First, we don't have a good way of identifying a particular Todo.  We would like to identify them by an id.  Second, we then need to tell each Todo component which Todo it is associated with.  Finally, when a user clicks on the delete button, we need to send the Todo's id in the along.  Let's implement these in turn.

1. Give each Todo an id

	An Todo should have an id the moment it gets created.  So, we know that our reducer creates the Todo when a CREATE_TODO action is dispatched.  Let's update the code in there so that it also adds an id. 
	
	reducers/manageTodo.js
	
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

	Ok, so essentially we implement a counter.  We initialize a variable id at the top of the file.  Because we are using modules, this variable, while not enclosed in a function, is local to the file.  Then each time the ADD_TODO action is dispatched, we create a new object by combining the payload of {text: 'our todo text'} and another javascript object simply with the id.  Now, click go to the react app, open the console, and add some todos, you will see, by inspecting the state, that the code is appropriately giving each Todo its own unique id.

2. Pass this id as a property to each Todo component

	Go back to the file components/todos/Todos.js.  Now inside our map function, we need to not only pass through the text of each Todo as a prop, but also the id as a prop.  So we change our render function to include the following.

	components/todos/Todo.js
	
	
		...
		render(){
		    let todos = this.props.store.getState().todos.map((todo, idx) => 			{
		      return <Todo key={idx} text={todo.text} id={todo.id} store={this.props.store} />
		    })
		...

	>Note: Notice that we implemented a key property.  Whenever we have a list of elements, we should pass through a unique key property so react can properly work its magic on the dom.  If we don't do that, we will receive a warning telling us to.

	Ok, so now inside of each Todo component, it will have a property of id with the correctly associated id.  Now from inside that Todo component, we can change our dispatch action to state precisely which Todo we will be deleting.  To implement this, we simply need to make one change to our handleClick function in the Todo component. 

	components/todos/Todo.js

		handleClick(){
		    this.props.store.dispatch({type: 'DELETE_TODO', payload: this.props.id})
		  }

	Because each component has the correct id as a prop, we simply need to send this along as a payload to our dispatched action.  
	
3. Have our reducer change our state

	Now that we are dispatching this action to a reducer, we need to tell our reducer how to make the appropriate modifications to our state. Essentially, when someone dispatches an action of type DELETE_TODO, along with the id of the todo we are deleting, we need to replace of our previous list of todos with a list that has each todos except the one in the payload.
	
	Ok, let's take advantage of the filter method, and add the following line code to our manageTodo reducer.
	
	reducers/manageTodo.js	
	
		let id = 0
		export default function manageTodo(state = {todos: []}, action){
		  switch (action.type) {
		    case 'ADD_TODO':
		    id++
		    let todo = Object.assign({}, action.payload, {id: id})
		      return {todos: state.todos.concat(todo)}
		    case 'DELETE_TODO':
		     let todos = state.todos.filter(function(todo){
		        return todo.id !== action.payload
		      })
		      return {todos: todos}
		    default:
		      return state;
		  }
		}

	 
	 
	So when the DELETE_TODO action is sent, we use the filter method to return all of the existing todos except the one with the id sent in the action.  The filter method returns to us a new array, which we then set as the value to the todos property.

Now add some todos, click on the a couple delete buttons, and there they are gone.  	
	
## Summary

Ok, so in this lesson we covered how to delete a specific Todo.  To implement this, we first gave each Todo a unique id, and then made sure we passed that id into each Todo component.  Then we made sure to send along that information when dispatching an action.  Finally, we had our reducer update the state by filtering out the Todo to be deleted.

