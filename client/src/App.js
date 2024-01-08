import { useState, useEffect } from 'react'

const API_BASE_URL = 'http://localhost:3001'

function App() {
  const [todos, setTodos] = useState([])
  const [popUpActive, setPopUpActive] = useState(false)
  const [newToDo, setNewToDo] = useState('')

  useEffect(() => {
    getToDos()

    console.log(todos)
  }, [])

  const getToDos = () => {
    // fetch(process.env.REACT_APP_LOCALHOST_URL + '/todos')
    fetch(API_BASE_URL + '/todos')
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error('Error: ', err))
  }

  const addTodo = async () => {
    const data = await fetch(API_BASE_URL + '/todo/create', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      }, 
      body: JSON.stringify({
        text: newToDo
      })
    }).then(res => res.json())

    setTodos([...todos, data])
    setPopUpActive(false)
    setNewToDo('')
  }

  const completeTodo = async id => {
    const data = await fetch(API_BASE_URL + '/todo/complete/' + id, {method: "PUT"})
      .then(res => res.json())
      
      setTodos(todos => todos.map(todo => {
        if(todo._id === data._id) {
          todo.complete = data.complete
        }

        return todo
      }))
      
  }

  const deleteTodo = async id => {
    const data = await fetch(API_BASE_URL + '/todo/delete/' + id, {method: 'DELETE'})
      .then(res => res.json())

      setTodos(todos => todos.filter(todo => todo._id !== data._id))
  }

  return (
    <div className='App'>
      <h1>Welcome, Dez</h1>
      <h4>Your Tasks</h4>

      <div className='todos'>
        {
          todos.map(todo => (
            <div 
              className={'todo ' + (todo.complete ? 'is-complete' : '')} 
              key={todo._id}
              onClick={() => completeTodo(todo._id)}
            >
              <div className='checkbox'></div>

              <div className='text'>{ todo.text }</div>

              <div className='delete-todo' onClick={() => deleteTodo(todo._id)}>x</div>
            </div>
          ))
        }
      </div>

      <div className="addPopup" onClick={() => setPopUpActive(true)}>+</div>

      {
        popUpActive ? (
          <div className="popup">
            <div className="content">
              <h3>Add Task</h3>
              <input type="text" className='add-todo-input' onChange={e => setNewToDo(e.target.value)}
                value={ newToDo }
              />
              <div className="button" onClick={addTodo}>Create Task</div>
            </div>
            <div className="closePopup" onClick={() => setPopUpActive(false)}>x</div>
          </div>
        ) : ('')
      }
    </div>
  )
}

export default App
