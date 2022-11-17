import React from 'react'

const TodoHeader = () => {
  return (
    <>
      <h1>CRUD Client</h1>
      <p>
        All CRUD operations work except for the following for simulating errors.
      </p>
      <ul>
        <li>
          Toggle base URL to INVALID, then try getting, editing, deleting, or
          adding.
        </li>
        <li>Edit or Delete the todo with "EDIT ERROR" or "DELETE ERROR"</li>
        <li>Add a todo called "ADD ERROR"</li>
        <li>Get a todo called "GET ERROR"</li>
      </ul>
      <p>Note: Backend refreshes data any time it gets restarted.</p>
    </>
  )
}

export default TodoHeader
