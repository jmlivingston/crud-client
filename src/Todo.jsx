import { useEffect, useRef, useState } from 'react'
import { fetchHelper } from './helpers'

const BAD_URL = 'http://localhost:4000/postsx/'
const BASE_URL = 'http://localhost:4000/posts/'

function Todo() {
  const dialogRef = useRef()
  const [date, setDate] = useState(new Date())
  const [url, setUrl] = useState(BASE_URL)
  const [item, setItem] = useState({ name: '' })
  const [items, setItems] = useState({})
  const [originalItems, setOriginalItems] = useState({})
  const [editId, setEditId] = useState()
  const [viewItem, setViewItem] = useState({})
  const [error, setError] = useState()

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
      setOriginalItems(items)
      setEditId(item.id)
    } else {
      try {
        setError()
        const response = await fetchHelper(`${url}${item.id}`, {
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
        if (response.ok) {
          setEditId()
        } else {
          throw response
        }
      } catch (error) {
        updateError(error)
      }
    }
  }

  const onDelete = async (item) => {
    try {
      setError()
      const response = await fetchHelper(`${url}${item.id}`, {
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
      const response = await fetchHelper(url, {
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
      updateError(error)
    }
  }

  const onView = async (id) => {
    try {
      setError()
      const response = await fetchHelper(`${url}${id}`)
      if (response.ok) {
        const json = await response.json()
        setViewItem(json)
        dialogRef.current.showModal()
      } else {
        throw response
      }
    } catch (error) {
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
        <li>Get and item called "GET CAUSES ERROR"</li>
      </ul>
      <hr />
      <div className="grid">
        <button onClick={() => setUrl(url === BASE_URL ? BAD_URL : BASE_URL)}>
          Toggle ({url === BASE_URL ? 'GOOD' : 'BAD'})
        </button>
        <button onClick={() => setDate(new Date())}>GET</button>
      </div>
      <hr />
      <h2>TODOS</h2>
      {Object.values(items).map((item) => {
        return (
          <div className="row" key={item.id}>
            <div className="col-4">
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
            </div>
            <div className="col-8">
              <div className="grid">
                <button onClick={() => onEditSave(item)}>
                  {editId !== item.id ? 'Edit (PUT)' : 'Save'}
                </button>
                <button
                  disabled={editId !== item.id}
                  onClick={() => {
                    setEditId()
                    setItems(originalItems)
                  }}>
                  Cancel
                </button>
                <button onClick={() => onDelete(item)}>DELETE</button>
                <button
                  onClick={() => {
                    onView(item.id)
                  }}>
                  View (GET)
                </button>
              </div>
            </div>
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

      <dialog id="view-dialog" ref={dialogRef}>
        <form className="w-50" method="dialog">
          <article>
            <header>
              <a
                aria-label="Close"
                className="close"
                onClick={() => {
                  dialogRef.current.close()
                  setViewItem({})
                }}
              />
              Item Details
            </header>
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(viewItem)?.map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </form>
      </dialog>
      {error && (
        <>
          Error
          <pre>
            <code>{JSON.stringify(error, null, 2)}</code>
          </pre>
        </>
      )}
    </div>
  )
}

export default Todo
