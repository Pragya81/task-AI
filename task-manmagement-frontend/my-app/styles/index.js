import { useState, useEffect } from 'react'
import Header from '../components/Header'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'

export default function Home() {
  const [tasks, setTasks] = useState([])

  const fetchTasks = async () => {
    const response = await fetch('http://localhost:8080/api/tasks')
    const data = await response.json()
    setTasks(data)
  }

  const addTask = async (task) => {
    await fetch('http://localhost:8080/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
    fetchTasks()
  }

  const deleteTask = async (id) => {
    await fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: 'DELETE',
    })
    fetchTasks()
  }

  useEffect(() => {
    fetchTasks()

    const socket = new WebSocket('ws://localhost:8080/ws')
    socket.onmessage = () => fetchTasks()
    return () => socket.close()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-8">
        <TaskForm onTaskCreated={addTask} />
        <TaskList tasks={tasks} onEdit={addTask} onDelete={deleteTask} />
      </main>
    </div>
  )
}
