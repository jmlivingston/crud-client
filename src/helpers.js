const fetchHelper = async (resource, options) => {
  let response
  try {
    response = await fetch(resource, options)
  } catch (error) {
    response = error
  }
  return response
}

export { fetchHelper }
