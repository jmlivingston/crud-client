import React from 'react'

const TodoHeader = () => {
  return (
    <>
      <h1>CRUD CLIENT</h1>
      <p>
        All CRUD operations work except for the following for simulating errors.
      </p>
      <ul>
        <li>
          Toggle base URL to BAD, then try getting, editing, deleting, or
          adding.
        </li>
        <li>
          Edit or Delete the todo with "EDIT CAUSES ERROR" or "DELETE CAUSES
          ERROR"
        </li>
        <li>Add a todo called "ADD CAUSES ERROR"</li>
        <li>Get a todo called "GET CAUSES ERROR"</li>
      </ul>
      <p>Note: Backend refreshes data any time it gets restarted.</p>
      <hr />
    </>
  )
}

export default TodoHeader
