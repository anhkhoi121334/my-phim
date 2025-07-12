import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import NotFoundPage from './pages/NotFoundPage';
import LoadingOverlay from './components/LoadingOverlay';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminMarketingPage from './pages/AdminMarketingPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminCustomersPage from './pages/AdminCustomersPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminAccountPage from './pages/AdminAccountPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import ProductManagementPage from './pages/ProductManagementPage';
import BannerManagementPage from './pages/BannerManagementPage';
import ContactPage from './pages/ContactPage';
import AccountPage from './pages/AccountPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import WishlistPage from './pages/WishlistPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OrderFailedPage from './pages/OrderFailedPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import CouponManagementPage from './pages/CouponManagementPage';
import FixedLayout from './components/layout/FixedLayout';

// Tạo QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Tách riêng component AppContent ra để có thể truy cập useAuth
function AppContent() {
  const location = useLocation();
  const [loadingPage, setLoadingPage] = useState(false);
  const prevPath = useRef(location.pathname);
  const { loading } = useAuth();

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      setLoadingPage(true);
      prevPath.current = location.pathname;
      const timeout = setTimeout(() => setLoadingPage(false), 600);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  const isAdminPage = location.pathname.startsWith('/admin');
  const isContactPage = location.pathname === '/contact';

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {loadingPage && <LoadingOverlay />}
      
      <Routes>
        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/marketing" element={<AdminMarketingPage />} />
          <Route path="/admin/products" element={<ProductManagementPage />} />
          <Route path="/admin/categories" element={<CategoryManagementPage />} />
          <Route path="/admin/coupons" element={<CouponManagementPage />} />
          <Route path="/admin/banners" element={<BannerManagementPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/account" element={<AdminAccountPage />} />
        </Route>

        {/* Contact Page */}
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Regular Pages with Fixed Layout */}
        <Route element={<FixedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/order-failed/:id" element={<OrderFailedPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<AccountPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/orders/:id/tracking" element={<OrderTrackingPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/order-failed" element={<OrderFailedPage />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {},
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 3000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
