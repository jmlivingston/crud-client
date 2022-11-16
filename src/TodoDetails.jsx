import React from 'react'

const TodoDetails = ({ todo }) => {
  return todo ? (
    <table>
      <thead>
        <tr>
          <th>Property</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(todo).map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{value.toString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : null
}

export default TodoDetails
