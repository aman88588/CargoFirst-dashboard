import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowRight } from 'lucide-react';

const Index = () => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container max-w-4xl px-4 text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <Briefcase className="h-10 w-10 text-primary-foreground" />
        </div>
        
        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          Welcome to Job Dashboard
        </h1>
        
        <p className="mb-8 text-xl text-muted-foreground">
          Manage your job postings, track applications, and analyze recruitment metrics all in one place
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2">
            <Link to="/signup">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          
          <Button asChild size="lg" variant="outline">
            <Link to="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
