import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Briefcase, FileText, User, BarChart3, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const navigation = [
    { name: 'Job Posted', href: '/dashboard', icon: FileText },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Customer Analysis', href: '/dashboard/analysis', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-muted">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-64 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Dashboard</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-3',
                      isActive && 'bg-secondary font-medium'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-border p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardLayout;
