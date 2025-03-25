import { useState, useEffect } from 'react'
import { getTasks } from '../lib/api'
import TaskForm from '../components/TaskForm'

export default function TaskList() {
  const [tasks, setTasks] = useState([])

  const fetchTasks = async () => {
    const data = await getTasks()
    setTasks(data)
  }

  useEffect(() => {
    fetchTasks()

    const socket = new WebSocket('ws://localhost:8080/ws')
    socket.onmessage = (event) => {
      console.log(event)
      fetchTasks()
    }

    return () => socket.close()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Task Management System</h1>
      <TaskForm onTaskCreated={fetchTasks} />
      {tasks.map((task) => (
        <div key={task.id} className="p-4 border rounded-lg mt-4">
          <h2 className="text-xl">{task.title}</h2>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
        </div>
      ))}
    </div>
  )
}
