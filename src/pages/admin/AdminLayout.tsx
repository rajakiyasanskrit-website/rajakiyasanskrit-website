import { Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../lib/admin-auth';
import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Images,
  Video,
  LogOut,
  Menu,
  X,
  Home,
  ChevronLeft,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/main_box/dashboard' },
  { icon: FileText, label: 'Notices', path: '/main_box/notices' },
  { icon: Calendar, label: 'Events', path: '/main_box/events' },
  { icon: Images, label: 'Gallery', path: '/main_box/gallery' },
  { icon: Video, label: 'Videos', path: '/main_box/videos' },
];

export default function AdminLayout() {
  const { user, loading, isAdmin, signOut } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sandalwood-900 to-sandalwood-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/main_box" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/main_box');
  };

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-sandalwood-50">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-sandalwood-900 to-sandalwood-950 text-cream-100 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sandalwood-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-maroon-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-devanagari font-bold text-cream-50 text-sm">गुरुकुल CMS</p>
              <p className="text-xs text-cream-400">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-sandalwood-800">
            <X className="w-5 h-5 text-cream-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-devanagari text-sm font-medium transition-all ${
                currentPath === item.path || (item.path !== '/main_box/dashboard' && currentPath.startsWith(item.path))
                  ? 'bg-gradient-to-r from-saffron-500 to-maroon-500 text-white shadow-lg'
                  : 'text-cream-300 hover:bg-sandalwood-800 hover:text-cream-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Links */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-sandalwood-700">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-cream-400 hover:bg-sandalwood-800 hover:text-cream-100 transition-all font-devanagari text-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>View Website</span>
          </a>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 transition-all font-devanagari text-sm mt-1"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-sandalwood-200 sticky top-0 z-30">
          <div className="h-full px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-sandalwood-100 text-sandalwood-600"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-sandalwood-600">
                <span className="font-devanagari font-medium">Welcome,</span>
                <span className="font-english text-sm">{user?.email?.split('@')[0]}</span>
              </div>
            </div>
            <div className="text-xs text-sandalwood-400">
              {new Date().toLocaleDateString('ne-NP', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
