import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import TaskList from '@/components/tasks/TaskList';
import TaskSuggestions from '@/components/tasks/TaskSuggestions';
import Navbar from '@/components/ui/Navbar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskForm from '@/components/tasks/TaskForm';

const Dashboard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [suggestionTitle, setSuggestionTitle] = useState('');
  
  // Handle selecting a suggestion
  const handleSelectSuggestion = (suggestion: string) => {
    setSuggestionTitle(suggestion);
    setIsCreateDialogOpen(true);
  };
  
  // Redirect if not authenticated
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" />;
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-[1400px] mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <h1 className="text-3xl font-medium title-text mb-6">Task Dashboard</h1>
            <TaskList />
          </div>
          
          <div className="lg:w-1/4 space-y-6">
            <TaskSuggestions onSelectSuggestion={handleSelectSuggestion} />
          </div>
        </div>
      </main>
      
      {/* Create Task Dialog from Suggestion */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm 
            task={{ 
              title: suggestionTitle,
              description: '',
              status: 'todo',
              priority: 'medium',
              createdBy: {
                id: '1',
                name: 'John Doe',
                email: 'john@example.com'
              },
              createdAt: new Date(),
              updatedAt: new Date(),
              tags: []
            } as any}
            onSuccess={() => setIsCreateDialogOpen(false)} 
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
