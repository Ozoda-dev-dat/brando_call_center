import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from '@/components/Sidebar';
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
  return (
    <Switch>
      <Route path="/" component={OperatorPage} />
      <Route path="/tickets" component={TicketsPage} />
      <Route path="/customers" component={CustomersPage} />
      <Route path="/service-centers" component={ServiceCentersPage} />
      <Route path="/masters" component={MastersPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <div className="flex h-screen w-full bg-background">
            <Sidebar />
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
