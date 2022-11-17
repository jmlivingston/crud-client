import { useEffect, useState } from 'react'
import AppInsightsInfo from './AppInsightsInfo'
import Code from './Code'
import { BASE_URL, BASE_URL_BROKEN } from './CONSTANTS'
import { fetchHelper } from './helpers/fetchHelper'
import Modal from './Modal'
import TodoDetails from './TodoDetails'
import TodoHeader from './TodoHeader'
import TodoRow from './TodoRow'

function Todo() {
  const [showDetails, setShowDetails] = useState(false)
  const [refresh, setRefresh] = useState(new Date())
  const [url, setUrl] = useState(BASE_URL)
  const [todo, setTodo] = useState({ name: '' })
  const [todos, setTodos] = useState({})
  const [originalTodos, setOriginalTodos] = useState({})
  const [putId, setPutId] = useState()
  const [viewTodo, setViewTodo] = useState({})
  const [error, setError] = useState()

  useEffect(() => {
    ;(async () => {
      setError()
      try {
        const response = await fetchHelper(url)
        if (response.ok) {
          const json = await response.json()
          const formattedJson = json.reduce(
            (acc, value) => ({ ...acc, [value.id]: value }),
            {}
          )
          setTodos(formattedJson)
        } else {
          throw response
        }
      } catch (error) {
        setTodos({})
        updateError(error)
      }
    })()
  }, [refresh])

  const updateError = async (response) => {
    let json = {}
    try {
      json = await response.json()
    } catch {}
    setError({
      message: json.error,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    })
  }

  const onUpdate = async (todo) => {
    if (putId !== todo.id) {
      setOriginalTodos(todos)
      setPutId(todo.id)
    } else {
      try {
        setError()
        const response = await fetchHelper(`${url}${todo.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            ...todo,
            completed: true,
            createdById: 2,
            createdDate: '2016-01-01',
            modifiedById: 2,
            modifiedDate: '2016-01-01',
          }),
        })
        if (response.ok) {
          setPutId()
        } else {
          throw response
        }
      } catch (error) {
        updateError(error)
      }
    }
  }

  const onDelete = async (todo) => {
    try {
      setError()
      const response = await fetchHelper(`${url}${todo.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        const { [todo.id]: _, ...filteredTodos } = todos
        setTodos(filteredTodos)
      } else {
        throw response
      }
    } catch (error) {
      updateError(error)
    }
  }

  const onAdd = async () => {
    try {
      setError()
      const date = new Date()
      const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
      const newTodo = {
        name: todo.name,
        completed: true,
        createdById: 2,
        createdDate: formattedDate,
        modifiedById: 2,
        modifiedDate: formattedDate,
      }
      const response = await fetchHelper(url, {
        method: 'POST',
        body: JSON.stringify(newTodo),
      })
      if (response.ok) {
        const json = await response.json()
        setOriginalTodos({ ...originalTodos, [json.id]: json })
        setTodos({ ...todos, [json.id]: json })
        setTodo({ name: '' })
      } else {
        throw response
      }
    } catch (error) {
      updateError(error)
    }
  }

  const onView = async (id) => {
    try {
      setError()
      const response = await fetchHelper(`${url}${id}`)
      if (response.ok) {
        const json = await response.json()
        setViewTodo(json)
        setShowDetails(true)
      } else {
        throw response
      }
    } catch (error) {
      updateError(error)
    }
  }

  return (
    <>
      <TodoHeader />
      <div className="grid">
        <button
          onClick={() => setUrl(url === BASE_URL ? BASE_URL_BROKEN : BASE_URL)}>
          Toggle Base URL ({url === BASE_URL ? 'VALID' : 'INVALID'})
        </button>
        <button onClick={() => setRefresh(new Date())}>GET</button>
      </div>
      <hr />
      <h2>Todos</h2>
      {Object.values(todos).map((todo) => (
        <TodoRow
          putId={putId}
          todos={todos}
          key={todo.id}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onView={onView}
          originalTodos={originalTodos}
          setPutId={setPutId}
          setTodos={setTodos}
          todo={todo}
        />
      ))}
      <div className="grid">
        <input
          type="text"
          value={todo?.name}
          onChange={(event) => setTodo({ name: event.target.value })}
        />
        <button disabled={!todo?.name} onClick={() => onAdd()}>
          POST
        </button>
      </div>
      <Modal
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false)
          setViewTodo({})
        }}
        title="Todo Details">
        <TodoDetails todo={viewTodo} />
      </Modal>
      {error && <hr />}
      <Code code={error} title="Error" />
      <hr />
      <AppInsightsInfo />
    </>
  )
}

export default Todo
