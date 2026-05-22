import { Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import ScrollToTop from './components/ScrollToTop';
import AdminApprovalsPage from './pages/AdminApprovalsPage';
import CheckoutPage from './pages/CheckoutPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import OrdersPage from './pages/OrdersPage';
import ProductDetailPage from './pages/ProductDetailPage';
import RegisterPage from './pages/RegisterPage';
import VendorApplyPage from './pages/VendorApplyPage';
import VendorDashboardPage from './pages/VendorDashboardPage';
import PresentationPage from './pages/PresentationPage';

const App = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/presentation" element={<PresentationPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/apply" element={<VendorApplyPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route
        path="/vendor"
        element={
          <RequireAuth roles={['vendor', 'admin']}>
            <VendorDashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAuth roles={['admin']}>
            <AdminApprovalsPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </>
);

export default App;
