import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Home from "./pages/Home";
import Products from "./pages/Products";
import WarehouseTracker from "./pages/WarehouseTracker";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminImages from "./pages/admin/AdminImages";
import AdminContent from "./pages/admin/AdminContent";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminProducts from "./pages/admin/AdminProducts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/warehouse-tracker" element={<WarehouseTracker />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />}>
              <Route index element={<AdminSettings />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="images" element={<AdminImages />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="submissions" element={<AdminSubmissions />} />
              <Route path="products" element={<AdminProducts />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
