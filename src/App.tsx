import { HashRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import Category from '@/pages/Category';
import MemberProfile from '@/pages/MemberProfile';
import Work from '@/pages/Work';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import { Login, Register } from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/dashboard/Dashboard';
import Admin from '@/pages/admin/Admin';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } });

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <HashRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="services" element={<Services />} />
                  <Route path="services/:categorySlug" element={<Category />} />
                  <Route path="members/:memberSlug" element={<MemberProfile />} />
                  <Route path="work" element={<Work />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="dashboard" element={<ProtectedRoute role="member"><Dashboard /></ProtectedRoute>} />
                  <Route path="admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </HashRouter>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
