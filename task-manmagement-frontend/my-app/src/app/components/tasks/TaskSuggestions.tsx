import React, { useState, useEffect } from 'react';
import { getTaskSuggestions } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, PlusCircle, Loader2 } from 'lucide-react';

interface TaskSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
}

const TaskSuggestions: React.FC<TaskSuggestionsProps> = ({ onSelectSuggestion }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load initial suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      setIsLoading(true);
      try {
        const data = await getTaskSuggestions();
        setSuggestions(data);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSuggestions();
  }, []);
  
  // Search for new suggestions
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const data = await getTaskSuggestions(searchTerm);
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle enter key in search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };
  
  return (
    <Card className="glass-card border-t-blue-200/50 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
          AI-Suggested Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for task ideas..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSearch} 
              disabled={isLoading || !searchTerm.trim()}
              variant="outline"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
            </Button>
          </div>
          
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/80" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Generating smart suggestions...
                  </p>
                </div>
              </div>
            ) : suggestions.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No suggestions available
              </p>
            ) : (
              suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors group cursor-pointer flex justify-between items-center"
                  onClick={() => onSelectSuggestion(suggestion)}
                >
                  <p className="text-sm flex-1">{suggestion}</p>
                  <PlusCircle className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary ml-2 flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskSuggestions;
