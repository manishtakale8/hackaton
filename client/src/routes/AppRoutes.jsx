import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// Student Pages
import DashboardPage from '../pages/student/DashboardPage';
import ProfilePage from '../pages/student/ProfilePage';
import ExplorePage from '../pages/student/ExplorePage';
import OpportunityDetailsPage from '../pages/student/OpportunityDetailsPage';
import SavedPage from '../pages/student/SavedPage';
import DeadlinesPage from '../pages/student/DeadlinesPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ManageOpportunitiesPage from '../pages/admin/ManageOpportunitiesPage';
import OpportunityFormPage from '../pages/admin/OpportunityFormPage';

// Admin Layout
import Navbar from '../components/layout/Navbar';

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
            ) : (
              <RegisterPage />
            )
          }
        />
        {/* Explore accessible without auth */}
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/opportunities/:id" element={<OpportunityDetailsPage />} />
      </Route>

      {/* Student routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/deadlines" element={<DeadlinesPage />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/opportunities"
        element={
          <AdminRoute>
            <AdminLayout>
              <ManageOpportunitiesPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/opportunities/new"
        element={
          <AdminRoute>
            <AdminLayout>
              <OpportunityFormPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/opportunities/:id/edit"
        element={
          <AdminRoute>
            <AdminLayout>
              <OpportunityFormPage />
            </AdminLayout>
          </AdminRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-6xl font-bold text-orange-500 mb-4">404</p>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
              <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
              <a href="/" className="btn-primary inline-flex px-6 py-3">Go Home</a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
