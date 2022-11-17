import React from 'react'

const Code = ({ code, title }) => {
  return code ? (
    <>
      {title && <h3>{title}</h3>}
      <pre>
        <code>{JSON.stringify(code, null, 2)}</code>
      </pre>
    </>
  ) : null
}

export default Code
