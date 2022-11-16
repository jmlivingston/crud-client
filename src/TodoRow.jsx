import React from 'react'

const TodoRow = ({
  editId,
  onDelete,
  onUpdate,
  onView,
  originalTodos,
  setEditId,
  setTodos,
  todo,
  todos,
}) => {
  return (
    <div className="row">
      <div className="col-4">
        {editId !== todo.id && <div>{todo.name}</div>}
        {editId === todo.id && (
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
            {editId !== todo.id ? 'Edit (PUT)' : 'Save'}
          </button>
          <button
            disabled={editId !== todo.id}
            onClick={() => {
              setEditId()
              setTodos(originalTodos)
            }}>
            Cancel
          </button>
          <button onClick={() => onDelete(todo)}>DELETE</button>
          <button
            onClick={() => {
              onView(todo.id)
            }}>
            View (GET)
          </button>
        </div>
      </div>
    </div>
  )
}

export default TodoRow
