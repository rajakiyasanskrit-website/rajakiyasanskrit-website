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
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/events" element={<Layout><EventsPage /></Layout>} />
        <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />
        <Route path="/notices" element={<Layout><NoticesPage /></Layout>} />
        <Route path="/admission" element={<Layout><AdmissionPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
