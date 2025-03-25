import React from 'react';
import { Task } from '@/services/api';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onStatusChange }) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'todo':
        return <Circle className="h-4 w-4 text-slate-500" />;
      case 'in-progress':
        return <ArrowRight className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  const getPriorityBadge = () => {
    switch (task.priority) {
      case 'low':
        return <Badge variant="outline" className="bg-slate-100 text-slate-800">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-100 text-red-800">High</Badge>;
      default:
        return null;
    }
  };
  
  const getNextStatus = () => {
    switch (task.status) {
      case 'todo':
        return 'in-progress';
      case 'in-progress':
        return 'completed';
      case 'completed':
        return 'todo';
      default:
        return 'todo';
    }
  };

  const handleStatusChange = () => {
    onStatusChange(task.id, getNextStatus());
  };
  
  const isDueDate = task.dueDate && new Date() > task.dueDate;
  
  return (
    <Card className="hover-lift glass-card overflow-hidden animate-scale-in">
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div 
              className="cursor-pointer" 
              onClick={handleStatusChange}
              title={`Mark as ${getNextStatus().replace('-', ' ')}`}
            >
              {getStatusIcon()}
            </div>
            <h3 className="text-lg font-medium title-text">{task.title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            {getPriorityBadge()}
            {task.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        {task.assignedTo && (
          <Avatar className="h-8 w-8 hover:ring-2 ring-primary/20 transition-all">
            <AvatarImage src={task.assignedTo.avatarUrl} alt={task.assignedTo.name} />
            <AvatarFallback>
              {task.assignedTo.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        )}
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm body-text line-clamp-2">{task.description}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          {task.dueDate ? (
            <span className={isDueDate ? 'text-red-500 font-medium' : ''}>
              {isDueDate ? 'Overdue: ' : 'Due: '}
              {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
            </span>
          ) : (
            <span>Updated {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}</span>
          )}
        </div>
        
        <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
          Edit
        </Button>
      </CardFooter>
      
      {/* Optional progress indicator for 'in-progress' tasks */}
      {task.status === 'in-progress' && (
        <div className="h-1 bg-blue-100 dark:bg-blue-900">
          <div className="h-1 bg-blue-500 w-1/2"></div>
        </div>
      )}
      
      {/* Optional completed indicator */}
      {task.status === 'completed' && (
        <div className="h-1 bg-green-500"></div>
      )}
    </Card>
  );
};

export default TaskItem;