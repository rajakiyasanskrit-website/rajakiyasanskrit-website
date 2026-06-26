import { Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../lib/admin-auth';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Images,
  Video,
  Download,
  Users,
  Mail,
  Settings,
  LogOut,
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  Home,
  User,
} from 'lucide-react';

const LotusIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2C12 2 8 6 8 10C8 12 10 14 12 14C14 14 16 12 16 10C16 6 12 2 12 2Z" />
    <path d="M12 14C12 14 6 12 4 14C2 16 3 20 6 20C8 20 10 18 12 14Z" />
    <path d="M12 14C12 14 18 12 20 14C22 16 21 20 18 20C16 20 14 18 12 14Z" />
    <path d="M12 14V22" />
  </svg>
);

const menuItems = [
  { icon: LayoutDashboard, label: 'ड्यासबोर्ड', path: '/main_box/dashboard', labelEn: 'Dashboard' },
  { icon: Home, label: 'होमपेज', path: '/main_box/homepage', labelEn: 'Homepage' },
  { icon: FileText, label: 'सूचनाहरू', path: '/main_box/notices', labelEn: 'Notices' },
  { icon: Calendar, label: 'कार्यक्रमहरू', path: '/main_box/events', labelEn: 'Events' },
  { icon: Images, label: 'ग्यालरी', path: '/main_box/gallery', labelEn: 'Gallery' },
  { icon: Video, label: 'भिडियोहरू', path: '/main_box/videos', labelEn: 'Videos' },
  { icon: Download, label: 'डाउनलोड', path: '/main_box/downloads', labelEn: 'Downloads' },
  { icon: Users, label: 'शिक्षक', path: '/main_box/faculty', labelEn: 'Faculty' },
  { icon: Mail, label: 'सन्देशहरू', path: '/main_box/messages', labelEn: 'Messages' },
  { icon: Settings, label: 'सेटिङहरू', path: '/main_box/settings', labelEn: 'Settings' },
];

export default function AdminLayout() {
  const { user, loading, isAdmin, signOut } = useAdminAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('admin-dark-mode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('admin-dark-mode', (!darkMode).toString());
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/main_box');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/main_box" replace />;
  }

  const currentPath = location.pathname;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <LotusIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">CMS</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">गुरुकुल म्यानेजर</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentPath === item.path
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.labelEn}</span>
              </button>
            ))}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Top Navbar */}
          <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
            <div className="h-full px-4 flex items-center justify-between">
              {/* Left */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>

                {/* Search */}
                <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2 w-64">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 ml-2 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                {/* Notifications */}
                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 relative">
                  <Bell className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {showProfileDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowProfileDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.email}</p>
                          <p className="text-xs text-slate-500">Administrator</p>
                        </div>
                        <button
                          onClick={() => {
                            navigate('/main_box/profile');
                            setShowProfileDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          Profile Settings
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
