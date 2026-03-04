import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import DreamCapture from "./pages/DreamCapture";
import DreamTimeline from "./pages/DreamTimeline";
import DreamDetail from "./pages/DreamDetail";
import DreamAtlas from "./pages/DreamAtlas";
import DreamSearch from "./pages/DreamSearch";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/capture" element={<DreamCapture />} />
            <Route path="/timeline" element={<DreamTimeline />} />
            <Route path="/dream/:id" element={<DreamDetail />} />
            <Route path="/atlas" element={<DreamAtlas />} />
            <Route path="/search" element={<DreamSearch />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
