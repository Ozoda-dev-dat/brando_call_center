import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthContext, useAuthProvider, useAuth } from "@/hooks/use-auth";
import { Sidebar } from '@/components/Sidebar';
import { ZadarmaWidget } from '@/components/ZadarmaWidget';
import LoginPage from '@/pages/login';
import OperatorPage from '@/pages/operator';
import TicketsPage from '@/pages/tickets';
import CustomersPage from '@/pages/customers';
import ServiceCentersPage from '@/pages/service-centers';
import MastersPage from '@/pages/masters';
import DashboardPage from '@/pages/dashboard';
import ReportsPage from '@/pages/reports';
import AdminPage from '@/pages/admin';
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const getDefaultRoute = () => {
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'operator':
        return '/';
      case 'master':
        return '/masters';
      default:
        return '/';
    }
  };

  const canAccess = (requiredRoles: string[]) => {
    return requiredRoles.includes(user.role);
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      <ZadarmaWidget />
      <Switch>
        <Route path="/">
          {canAccess(['admin', 'operator']) ? (
            <OperatorPage />
          ) : (
            <Redirect to={getDefaultRoute()} />
          )}
        </Route>
        <Route path="/tickets">
          {canAccess(['admin', 'operator']) ? (
            <TicketsPage />
          ) : (
            <Redirect to={getDefaultRoute()} />
          )}
        </Route>
        <Route path="/customers">
          {canAccess(['admin', 'operator']) ? (
            <CustomersPage />
          ) : (
            <Redirect to={getDefaultRoute()} />
          )}
        </Route>
        <Route path="/service-centers">
          {canAccess(['admin', 'operator']) ? (
            <ServiceCentersPage />
          ) : (
            <Redirect to={getDefaultRoute()} />
          )}
        </Route>
        <Route path="/masters">
          {canAccess(['admin', 'operator', 'master']) ? (
            <MastersPage />
          ) : (
            <Redirect to={getDefaultRoute()} />
          )}
        </Route>
        <Route path="/dashboard">
          {canAccess(['admin', 'operator']) ? (
            <DashboardPage />
          ) : (
            <Redirect to={getDefaultRoute()} />
          )}
        </Route>
        <Route path="/reports">
          {canAccess(['admin', 'operator']) ? (
            <ReportsPage />
          ) : (
            <Redirect to={getDefaultRoute()} />
          )}
        </Route>
        <Route path="/admin">
          {canAccess(['admin']) ? (
            <AdminPage />
          ) : (
            <Redirect to={getDefaultRoute()} />
          )}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  const auth = useAuthProvider();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AuthContext.Provider value={auth}>
            <Router />
            <Toaster />
          </AuthContext.Provider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
