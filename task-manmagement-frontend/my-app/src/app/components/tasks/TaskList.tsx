import React, { useState, useEffect } from 'react';
import { Task, getTasks, updateTask } from '@/services/api';
import TaskItem from './TaskItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskForm from './TaskForm';
import WebSocketService from '@/services/websocket';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Fetch tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
    
    // Connect to WebSocket service
    WebSocketService.connect();
    
    // Subscribe to WebSocket events
    const unsubscribe = WebSocketService.subscribe((event) => {
      switch (event.type) {
        case 'TASK_CREATED':
          setTasks(prev => [...prev, event.payload]);
          break;
        case 'TASK_UPDATED':
          setTasks(prev => 
            prev.map(task => 
              task.id === event.payload.id ? event.payload : task
            )
          );
          break;
        case 'TASK_DELETED':
          setTasks(prev => 
            prev.filter(task => task.id !== event.payload.id)
          );
          break;
      }
    });
    
    // Disconnect on component unmount
    return () => {
      unsubscribe();
      WebSocketService.disconnect();
    };
  }, []);
  
  // Handle task status change
  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      const updatedTask = await updateTask(taskId, { status: newStatus });
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };
  
  // Handle edit task
  const handleEditTask = (task: Task) => {
    setEditTask(task);
  };
  
  // Handle edit task dialog close
  const handleEditDialogClose = () => {
    setEditTask(null);
  };
  
  // Filter tasks based on search term and selected tab
  const filteredTasks = tasks.filter(task => {
    // Filter by search term
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by tab
    if (selectedTab === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && task.status === selectedTab;
    }
  });
  
  // Create task sections based on priority
  const highPriorityTasks = filteredTasks.filter(task => task.priority === 'high');
  const mediumPriorityTasks = filteredTasks.filter(task => task.priority === 'medium');
  const lowPriorityTasks = filteredTasks.filter(task => task.priority === 'low');
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedTab} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary/80" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No tasks found</h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm ? 'Try a different search term' : 'Create a new task to get started'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {highPriorityTasks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">High Priority</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {highPriorityTasks.map(task => (
                      <TaskItem 
                        key={task.id} 
                        task={task} 
                        onEdit={handleEditTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {mediumPriorityTasks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Medium Priority</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mediumPriorityTasks.map(task => (
                      <TaskItem 
                        key={task.id} 
                        task={task} 
                        onEdit={handleEditTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {lowPriorityTasks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Low Priority</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lowPriorityTasks.map(task => (
                      <TaskItem 
                        key={task.id} 
                        task={task} 
                        onEdit={handleEditTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Create Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm 
            onSuccess={() => setIsCreateDialogOpen(false)} 
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Task Dialog */}
      <Dialog open={!!editTask} onOpenChange={handleEditDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editTask && (
            <TaskForm 
              task={editTask}
              onSuccess={handleEditDialogClose} 
              onCancel={handleEditDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;