
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ActivityView from "./pages/ActivityView";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import EventCreate from "./pages/EventCreate";
import EventEdit from "./pages/EventEdit";
import Schedule from "./pages/Schedule";
import Content from "./pages/Content";
import ContentView from "./pages/ContentView";
import ContentCreate from "./pages/ContentCreate";
import ContentEdit from "./pages/ContentEdit";
import Ambassadors from "./pages/Ambassadors";
import AmbassadorView from "./pages/AmbassadorView";
import AmbassadorCreate from "./pages/AmbassadorCreate";
import AmbassadorEdit from "./pages/AmbassadorEdit";
import { useState } from "react";

const App = () => {
  // Create a QueryClient instance inside the component to avoid SSR and HMR issues
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public route */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/activity" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/activity/:id" element={<ProtectedRoute><ActivityView /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/create" element={<ProtectedRoute><EventCreate /></ProtectedRoute>} />
              <Route path="/edit/:id" element={<ProtectedRoute><EventEdit /></ProtectedRoute>} />
              <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
              <Route path="/content" element={<ProtectedRoute><Content /></ProtectedRoute>} />
              <Route path="/content/:id" element={<ProtectedRoute><ContentView /></ProtectedRoute>} />
              <Route path="/content/new" element={<ProtectedRoute><ContentCreate /></ProtectedRoute>} />
              <Route path="/content/edit/:id" element={<ProtectedRoute><ContentEdit /></ProtectedRoute>} />
              <Route path="/ambassadors" element={<ProtectedRoute><Ambassadors /></ProtectedRoute>} />
              <Route path="/ambassadors/:id" element={<ProtectedRoute><AmbassadorView /></ProtectedRoute>} />
              <Route path="/ambassadors/new" element={<ProtectedRoute><AmbassadorCreate /></ProtectedRoute>} />
              <Route path="/ambassadors/edit/:id" element={<ProtectedRoute><AmbassadorEdit /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
