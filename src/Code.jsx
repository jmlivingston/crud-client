import React from 'react'

const Code = ({ code, title }) => {
  return code ? (
    <>
      {title}
      <pre>
        <code>{JSON.stringify(code, null, 2)}</code>
      </pre>
    </>
  ) : null
}

export default Code
