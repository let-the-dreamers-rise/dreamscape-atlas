import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import DreamCapture from "./pages/DreamCapture";
import DreamTimeline from "./pages/DreamTimeline";
import DreamDetail from "./pages/DreamDetail";
import DreamAtlas from "./pages/DreamAtlas";
import DreamSearch from "./pages/DreamSearch";
import MemoryClusters from "./pages/MemoryClusters";
import NeuralSovereignty from "./pages/NeuralSovereignty";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/capture" element={<DreamCapture />} />
              <Route path="/timeline" element={<DreamTimeline />} />
              <Route path="/dream/:id" element={<DreamDetail />} />
              <Route path="/atlas" element={<DreamAtlas />} />
              <Route path="/clusters" element={<MemoryClusters />} />
              <Route path="/sovereignty" element={<NeuralSovereignty />} />
              <Route path="/search" element={<DreamSearch />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
