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
        <li>PUT or DELETE the todo with "PUT ERROR" or "DELETE ERROR"</li>
        <li>POST a todo called "POST ERROR"</li>
        <li>GET a todo called "GET ERROR"</li>
      </ul>
      <small>
        Notes:{' '}
        <ul>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods"
              target="_blank">
              HTTP verbs
            </a>{' '}
            are used to describe CRUD operations: POST (create), GET (read), PUT
            (update), and DELETE (delete).
          </li>
          <li>Backend refreshes data any time it gets restarted.</li>
        </ul>
      </small>
    </>
  )
}

export default TodoHeader
