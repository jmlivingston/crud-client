import React from 'react'

const TodoRow = ({
  putId,
  onDelete,
  onUpdate,
  onView,
  originalTodos,
  setPutId,
  setTodos,
  todo,
  todos,
}) => {
  return (
    <div className="row">
      <div className="col-4">
        {putId !== todo.id && <div>{todo.name}</div>}
        {putId === todo.id && (
          <input
            value={todo.name}
            onChange={(event) =>
              setTodos({
                ...todos,
                [todo.id]: { ...todo, name: event.target.value },
              })
            }
          />
        )}
      </div>
      <div className="col-8">
        <div className="grid">
          <button onClick={() => onUpdate(todo)}>
            {putId !== todo.id ? 'Edit' : 'PUT'}
          </button>
          <button
            disabled={putId !== todo.id}
            onClick={() => {
              setPutId()
              setTodos(originalTodos)
            }}>
            Cancel
          </button>
          <button onClick={() => onDelete(todo)}>DELETE</button>
          <button
            onClick={() => {
              onView(todo.id)
            }}>
            GET
          </button>
        </div>
      </div>
    </div>
  )
}

export default TodoRow
