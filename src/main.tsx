import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import GalleryPage from './pages/GalleryPage';
import NoticesPage from './pages/NoticesPage';
import AdmissionPage from './pages/AdmissionPage';
import { AdminAuthProvider } from './lib/admin-auth';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNotices from './pages/admin/AdminNotices';
import NoticeEditor from './pages/admin/NoticeEditor';
import AdminEvents from './pages/admin/AdminEvents';
import AdminGallery from './pages/admin/AdminGallery';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';
import AdminHomepage from './pages/admin/AdminHomepage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/events" element={<Layout><EventsPage /></Layout>} />
        <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />
        <Route path="/notices" element={<Layout><NoticesPage /></Layout>} />
        <Route path="/admission" element={<Layout><AdmissionPage /></Layout>} />

        {/* Admin Routes - Hidden URL */}
        <Route
          path="/main_box"
          element={
            <AdminAuthProvider>
              <AdminLoginPage />
            </AdminAuthProvider>
          }
        />
        <Route
          path="/main_box/*"
          element={
            <AdminAuthProvider>
              <Routes>
                <Route element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="notices" element={<AdminNotices />} />
                  <Route path="notices/new" element={<NoticeEditor />} />
                  <Route path="notices/edit/:id" element={<NoticeEditor />} />
                  <Route path="events" element={<AdminEvents />} />
                  <Route path="gallery" element={<AdminGallery />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="homepage" element={<AdminHomepage />} />
                  <Route path="*" element={<AdminDashboard />} />
                </Route>
              </Routes>
            </AdminAuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
