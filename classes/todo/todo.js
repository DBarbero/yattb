/*
  Todo model: { id: 1, des: 'Work on todo bot', completed: false }
*/

export default class Todo {

  constructor (params) {
    this.todos = []
  }

  addTodo(text) {
    let newTodo = { id: new Date().getTime(), des: text, completed: false }
    return this.todos = [...this.todos, newTodo]
  }

  toggleTodo(id) { return this.todos = this.todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo) }

  deleteTodo(id) { return this.todos = this.todos.filter(todo => id !== todo.id) }

  deleteByIndex(index) { return this.todos = this.todos.filter( (todo, i) => i != index ) }

  showTodos() { return this.todos.map( (todo, index) => `${index} - ${todo.des}`).join('\n') }

};
