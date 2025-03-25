const API_URL = 'http://localhost:8080'

export const getTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`)
  return response.json()
}

export const createTask = async (task) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  return response.json()
}
