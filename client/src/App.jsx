import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Login from "@/components/Login";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Dashboard from "@/pages/Dashboard";
import Timer from "@/pages/Timer";
import Statistics from "@/pages/Statistics";
import Achievements from "@/pages/Achievements";
import Leaderboard from "@/pages/Leaderboard";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import PageNotFound from "@/pages/PageNotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />

              <BrowserRouter>
                <div className="min-h-screen flex flex-col bg-background">
                  <Navbar />

                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/timer" element={<Timer />} />

                      <Route
                        path="/statistics"
                        element={
                          <ProtectedRoute>
                            <Statistics />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/achievements"
                        element={
                          <ProtectedRoute>
                            <Achievements />
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/leaderboard"
                        element={
                          <ProtectedRoute>
                            <Leaderboard />
                          </ProtectedRoute>
                        }
                      />

                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="*" element={<PageNotFound />} />
                    </Routes>
                  </main>

                  <Footer />
                  <Login />
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
