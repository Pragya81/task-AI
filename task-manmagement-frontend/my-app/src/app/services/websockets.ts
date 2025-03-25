import { toast } from '@/hooks/use-toast';
import { Task } from './api';

// WebSocket Events
type WebSocketEvent = 
  | { type: 'TASK_CREATED', payload: Task }
  | { type: 'TASK_UPDATED', payload: Task }
  | { type: 'TASK_DELETED', payload: { id: string } };

// WebSocket connection manager
class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: ((event: WebSocketEvent) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.reconnect = this.reconnect.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  // Connect to WebSocket server
  connect() {
    if (this.socket) {
      return;
    }

    try {
      // Mock WebSocket - in a real app this would connect to your server
      // this.socket = new WebSocket('wss://your-api.com/ws');
      
      // For demo purposes, we'll simulate WebSocket events instead
      this.simulateConnection();
      
      toast({
        title: "Connected to server",
        description: "You'll receive real-time updates.",
        duration: 3000,
      });
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.reconnect();
    }
  }

  // Simulate WebSocket for demo
  private simulateConnection() {
    // Simulate successful connection
    console.log('WebSocket connected (simulated)');
    
    // After 2 seconds, simulate a new task created by someone else
    setTimeout(() => {
      this.mockEvent({
        type: 'TASK_CREATED',
        payload: {
          id: 'ws-1',
          title: 'Review new design assets',
          description: 'Check the new brand assets and provide feedback.',
          status: 'todo',
          priority: 'medium',
          assignedTo: {
            id: '3',
            name: 'Alex Johnson',
            email: 'alex@example.com'
          },
          createdBy: {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          dueDate: new Date(Date.now() + 86400000 * 3),
          tags: ['design', 'review']
        }
      });
    }, 2000);
    
    // After 5 seconds, simulate a task update
    setTimeout(() => {
      this.mockEvent({
        type: 'TASK_UPDATED',
        payload: {
          id: '1',
          title: 'Complete project proposal',
          description: 'Draft the initial project proposal with timeline and budget estimates. Added client requirements.',
          status: 'completed',
          priority: 'high',
          assignedTo: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com'
          },
          createdBy: {
            id: '1',
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          createdAt: new Date(Date.now() - 86400000 * 2),
          updatedAt: new Date(),
          dueDate: new Date(Date.now() + 86400000 * 2),
          tags: ['proposal', 'planning', 'completed']
        }
      });
    }, 5000);
  }

  // Mock an event for demo purposes
  mockEvent(event: WebSocketEvent) {
    this.messageHandlers.forEach(handler => handler(event));
    
    // Show toast notification based on event type
    switch (event.type) {
      case 'TASK_CREATED':
        toast({
          title: "New task created",
          description: `"${event.payload.title}" was added by ${event.payload.createdBy.name}`,
          duration: 5000,
        });
        break;
      case 'TASK_UPDATED':
        toast({
          title: "Task updated",
          description: `"${event.payload.title}" was updated to ${event.payload.status}`,
          duration: 5000,
        });
        break;
      case 'TASK_DELETED':
        toast({
          title: "Task deleted",
          description: "A task was removed from your workspace",
          duration: 5000,
        });
        break;
    }
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.reconnectAttempts = 0;
    console.log('WebSocket disconnected');
  }

  // Reconnect logic
  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnection attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Message handler
  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data) as WebSocketEvent;
      this.messageHandlers.forEach(handler => handler(data));
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  // Subscribe to WebSocket events
  subscribe(handler: (event: WebSocketEvent) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }
}

export default new WebSocketService();
