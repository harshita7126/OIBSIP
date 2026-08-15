import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { PizzaBuilderProvider } from './context/PizzaBuilderContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { CartDrawer } from './components/cart/CartDrawer';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminHeader } from './components/admin/AdminHeader';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/public/ResetPasswordPage';
import { VerifyEmailPage } from './pages/public/VerifyEmailPage';

// User Pages
import { MenuPage } from './pages/user/MenuPage';
import { PizzaDetailsPage } from './pages/user/PizzaDetailsPage';
import { CustomBuilderPage } from './pages/user/CustomBuilderPage';
import { CartPage } from './pages/user/CartPage';
import { CheckoutPage } from './pages/user/CheckoutPage';
import { OrderTrackingPage } from './pages/user/OrderTrackingPage';
import { ProfilePage } from './pages/user/ProfilePage';
import { OrderHistoryPage } from './pages/user/OrderHistoryPage';
import { AccountSettingsPage } from './pages/user/AccountSettingsPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminSettings } from './pages/admin/AdminSettings';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) {
    if (location.pathname === '/admin/login') {
      return children;
    }
    return (
      <div className="flex min-h-screen bg-slate-950">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader title="CraveCrust Store Telemetry" />
          <main className="p-6 sm:p-8 flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-charcoal">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <PizzaBuilderProvider>
            <Router>
              <MainLayout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />

                  {/* User Routes */}
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/pizza/:id" element={<PizzaDetailsPage />} />
                  <Route path="/builder" element={<CustomBuilderPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/track" element={<OrderTrackingPage />} />
                  <Route path="/tracker" element={<OrderTrackingPage />} />
                  <Route path="/track/:id" element={<OrderTrackingPage />} />

                  {/* Protected User Routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute requireAuth>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute requireAuth>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute requireAuth>
                        <OrderHistoryPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute requireAuth>
                        <AccountSettingsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/inventory"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminInventory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminProducts />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminOrders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/customers"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminCustomers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminAnalytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminSettings />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </MainLayout>
              <ToastContainer />
            </Router>
          </PizzaBuilderProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
