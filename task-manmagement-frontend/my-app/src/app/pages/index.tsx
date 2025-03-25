import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthContext';
import Navbar from '@/components/ui/Navbar';
import { CheckCircle, Clock, Users, Sparkles, Zap, Shield } from 'lucide-react';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-2 animate-fade-in">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl title-text">
                  Simplify task management with real-time collaboration
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl body-text">
                  TaskSphere helps your team stay organized and focused with AI-powered task management
                </p>
              </div>
              <div className="space-x-4 animate-slide-in">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="h-11 px-8">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button size="lg" className="h-11 px-8">
                      Get Started Free
                    </Button>
                  </Link>
                )}
                <Button size="lg" variant="outline" className="h-11 px-8">
                  Learn More
                </Button>
              </div>
              <div className="w-full max-w-4xl animate-fade-in delay-300">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent h-40 -bottom-5 z-10" />
                  <img
                    src="https://placehold.co/1200x675/f5f7fa/a2afc1?text=TaskSphere+Dashboard"
                    alt="TaskSphere Dashboard"
                    className="rounded-lg border shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900" id="features">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm">
                Core Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl title-text">
                Everything you need to manage tasks efficiently
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl body-text">
                Our platform combines powerful features with a simple interface to help you get more done
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover-lift glass-card">
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Task Management</CardTitle>
                  <CardDescription>
                    Create, organize, and prioritize tasks with intuitive tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="body-text">
                    Easily create tasks, set priorities, assign them to team members, and track progress in real-time.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift glass-card">
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Real-time Updates</CardTitle>
                  <CardDescription>
                    See changes as they happen without refreshing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="body-text">
                    All changes sync instantly across devices, keeping everyone on the same page with WebSocket technology.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift glass-card">
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Team Collaboration</CardTitle>
                  <CardDescription>
                    Work together seamlessly with your team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="body-text">
                    Assign tasks, share feedback, and collaborate efficiently with team members on projects.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift glass-card">
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4">AI-Powered Suggestions</CardTitle>
                  <CardDescription>
                    Get smart task recommendations based on your work
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="body-text">
                    Our AI analyzes your workflow and suggests tasks to keep your projects moving forward efficiently.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift glass-card">
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Performance Analytics</CardTitle>
                  <CardDescription>
                    Track productivity and progress with insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="body-text">
                    Visualize team performance, identify bottlenecks, and optimize your workflow with detailed analytics.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift glass-card">
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4">Secure Authentication</CardTitle>
                  <CardDescription>
                    Keep your data protected with JWT security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="body-text">
                    Enterprise-grade security with JWT authentication ensures your task data stays private and secure.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl title-text">
                  Ready to streamline your tasks?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl body-text">
                  Join thousands of teams already using TaskSphere to boost productivity
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/login">
                  <Button size="lg" className="h-11 px-8">
                    Get Started Free
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-11 px-8">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1">
              <span className="text-lg font-semibold">TaskSphere</span>
              <p className="text-sm text-muted-foreground">© 2023. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
