import { useEffect, useState } from 'react'

const BASE_URL = 'https://dev-rest-api.herokuapp.com/posts/'

function Todo() {
  const [date, setDate] = useState(new Date())
  const [url, setUrl] = useState(BASE_URL)
  const [item, setItem] = useState({ name: '' })
  const [items, setItems] = useState({})
  const [editId, setEditId] = useState()
  const [error, setError] = useState()

  const updateError = (response) => {
    setError({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    })
  }

  useEffect(() => {
    ;(async () => {
      setError()
      try {
        const response = await fetch(url)
        if (response.ok) {
          const json = await response.json()
          const formattedJson = json.reduce(
            (acc, value) => ({ ...acc, [value.id]: value }),
            {}
          )
          setItems(formattedJson)
        } else {
          throw response
        }
      } catch (error) {
        setItems({})
        updateError(error)
      }
    })()
  }, [date])

  const onEditSave = async (item) => {
    if (editId !== item.id) {
      setEditId(item.id)
    } else {
      try {
        setError()
        const response = await fetch(`${url}${item.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify({
            ...item,
            completed: true,
            createdById: 2,
            createdDate: '2016-01-01',
            modifiedById: 2,
            modifiedDate: '2016-01-01',
          }),
        })
        if (!response.ok) {
          throw response
        }
      } catch (error) {
        updateError(error)
      }
      setEditId()
    }
  }

  const onDelete = async (item) => {
    try {
      setError()
      const response = await fetch(`${url}${item.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      })
      if (response.ok) {
        const { [item.id]: _, ...filteredItems } = items
        setItems(filteredItems)
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
      const newItem = {
        name: item.name,
        completed: true,
        createdById: 2,
        createdDate: formattedDate,
        modifiedById: 2,
        modifiedDate: formattedDate,
      }
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(newItem),
      })
      if (response.ok) {
        const json = await response.json()
        setItems({ ...items, [json.id]: json })
        setItem({ name: '' })
      } else {
        throw response
      }
    } catch (error) {
      setItems({})
      updateError(error)
    }
  }

  return (
    <div className="container">
      <h1>CRUD CLIENT</h1>
      <p>To mimic an error for all CRUD operations, do the following:</p>
      <ul>
        <li>
          Toggle to a bad URL, then try getting, editing, deleting, or adding.
        </li>
        <li>
          Edit or Delete the item "EDIT CAUSES ERROR" or "DELETE CAUSES ERROR"
        </li>
        <li>Add an item called "ADD CAUSES ERROR"</li>
      </ul>
      <hr />
      <div className="grid">
        <button
          onClick={() =>
            setUrl(
              url === BASE_URL
                ? 'https://dev-rest-api.herokuapp.com/postsx/'
                : BASE_URL
            )
          }>
          Toggle ({url === BASE_URL ? 'GOOD' : 'BAD'})
        </button>
        <button onClick={() => setDate(new Date())}>GET</button>
      </div>
      <hr />
      <h2>TODOS</h2>
      {Object.values(items).map((item) => {
        return (
          <div className="grid" key={item.id}>
            {editId !== item.id && <div>{item.name}</div>}
            {editId === item.id && (
              <input
                value={item.name}
                onChange={(event) =>
                  setItems({
                    ...items,
                    [item.id]: { ...item, name: event.target.value },
                  })
                }
              />
            )}
            <button onClick={() => onEditSave(item)}>
              {editId !== item.id ? 'Edit' : 'Save'}
            </button>
            <button onClick={() => onDelete(item)}>Delete</button>
          </div>
        )
      })}
      <div className="grid">
        <input
          type="text"
          value={item?.name}
          onChange={(event) => setItem({ name: event.target.value })}
        />
        <button disabled={!item} onClick={() => onAdd()}>
          Add
        </button>
      </div>
      {error && (
        <>
          Error
          <pre>
            <code>{JSON.stringify(error, null, 2)}</code>
          </pre>
        </>
      )}
      <pre>
        <code>{JSON.stringify(items, null, 2)}</code>
      </pre>
    </div>
  )
}

export default Todo
