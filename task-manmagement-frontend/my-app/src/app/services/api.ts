import { toast } from '@/hooks/use-toast';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: User;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags: string[];
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: '3',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=8'
  }
];

let mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Draft the initial project proposal with timeline and budget estimates.',
    status: 'in-progress',
    priority: 'high',
    assignedTo: mockUsers[0],
    createdBy: mockUsers[1],
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    updatedAt: new Date(Date.now() - 43200000), // 12 hours ago
    dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    tags: ['proposal', 'planning']
  },
  {
    id: '2',
    title: 'Design user interface mockups',
    description: 'Create wireframes and high-fidelity mockups for the main user flows.',
    status: 'todo',
    priority: 'medium',
    assignedTo: mockUsers[1],
    createdBy: mockUsers[0],
    createdAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
    dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
    tags: ['design', 'ui/ux']
  },
  {
    id: '3',
    title: 'Set up deployment pipeline',
    description: 'Configure the CI/CD pipeline for automated testing and deployment.',
    status: 'completed',
    priority: 'high',
    assignedTo: mockUsers[2],
    createdBy: mockUsers[0],
    createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
    updatedAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
    dueDate: new Date(Date.now() - 86400000 * 1), // 1 day ago (past due)
    tags: ['devops', 'infrastructure']
  }
];

// API functions
export const getTasks = async (): Promise<Task[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockTasks;
};

export const getTask = async (id: string): Promise<Task | undefined> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockTasks.find(task => task.id === id);
};

export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const newTask: Task = {
    id: Math.random().toString(36).substring(2, 9),
    title: taskData.title || 'Untitled Task',
    description: taskData.description || '',
    status: taskData.status || 'todo',
    priority: taskData.priority || 'medium',
    assignedTo: taskData.assignedTo,
    createdBy: mockUsers[0], // Assuming current user
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: taskData.dueDate,
    tags: taskData.tags || []
  };
  
  mockTasks = [...mockTasks, newTask];
  
  // Notify success
  toast({
    title: "Task created",
    description: "Your task has been created successfully.",
  });
  
  return newTask;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const taskIndex = mockTasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  
  const updatedTask = {
    ...mockTasks[taskIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  mockTasks = [
    ...mockTasks.slice(0, taskIndex),
    updatedTask,
    ...mockTasks.slice(taskIndex + 1)
  ];
  
  // Notify success
  toast({
    title: "Task updated",
    description: "The task has been updated successfully.",
  });
  
  return updatedTask;
};

export const deleteTask = async (id: string): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 400));
  
  mockTasks = mockTasks.filter(task => task.id !== id);
  
  // Notify success
  toast({
    title: "Task deleted",
    description: "The task has been deleted successfully.",
  });
};

export const getUsers = async (): Promise<User[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockUsers;
};

// AI suggestions mock
export const getTaskSuggestions = async (input?: string): Promise<string[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Default suggestions
  const defaultSuggestions = [
    "Schedule team meeting to discuss project milestones",
    "Create documentation for the API endpoints",
    "Review and update test coverage for critical components",
    "Optimize database queries for better performance",
    "Prepare presentation slides for the client demo"
  ];
  
  // If input is provided, generate more specific suggestions
  if (input && input.length > 0) {
    const specificSuggestions = [
      `Review ${input} documentation and identify gaps`,
      `Schedule a knowledge sharing session about ${input}`,
      `Create a performance benchmark for ${input}`,
      `Develop a migration plan for updating ${input}`
    ];
    return specificSuggestions;
  }
  
  return defaultSuggestions;
};
