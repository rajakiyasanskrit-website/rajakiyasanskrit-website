import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  FileText,
  Calendar,
  Images,
  Video,
  Download,
  Users,
  Mail,
  TrendingUp,
  Clock,
  Activity,
  Plus,
  ArrowRight,
  AlertCircle,
  Eye,
  Trash2,
} from 'lucide-react';

interface DashboardStats {
  total_notices: number;
  published_notices: number;
  total_events: number;
  upcoming_events: number;
  total_albums: number;
  total_photos: number;
  total_videos: number;
  total_downloads: number;
  total_faculty: number;
  unread_messages: number;
  storage_used_mb: number;
}

interface RecentActivity {
  id: string;
  action: string;
  resource_type: string;
  resource_title: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const [noticesResult, eventsResult, albumsResult, photosResult, videosResult, downloadsResult, facultyResult, messagesResult, activityResult] = await Promise.all([
        supabase.from('cms_notices').select('id', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('cms_events').select('id', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('cms_albums').select('id', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('cms_photos').select('id', { count: 'exact', head: true }),
        supabase.from('cms_videos').select('id', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('cms_downloads').select('id, file_size', { count: 'exact' }).is('deleted_at', null),
        supabase.from('cms_faculty').select('id', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('cms_contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('cms_activity_log').select('*').order('created_at', { ascending: false }).limit(10),
      ]);

      const totalStorage = (downloadsResult.data || []).reduce((sum, item) => sum + (item.file_size || 0), 0);

      setStats({
        total_notices: noticesResult.count || 0,
        published_notices: noticesResult.count || 0,
        total_events: eventsResult.count || 0,
        upcoming_events: eventsResult.count || 0,
        total_albums: albumsResult.count || 0,
        total_photos: photosResult.count || 0,
        total_videos: videosResult.count || 0,
        total_downloads: downloadsResult.count || 0,
        total_faculty: facultyResult.count || 0,
        unread_messages: messagesResult.count || 0,
        storage_used_mb: Math.round(totalStorage / (1024 * 1024) * 100) / 100,
      });

      setRecentActivity(activityResult.data || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2" />
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { icon: FileText, label: 'Notices', value: stats?.total_notices || 0, color: 'orange', path: '/main_box/notices' },
    { icon: Calendar, label: 'Events', value: stats?.total_events || 0, color: 'red', path: '/main_box/events' },
    { icon: Images, label: 'Albums', value: stats?.total_albums || 0, color: 'amber', path: '/main_box/gallery' },
    { icon: Eye, label: 'Photos', value: stats?.total_photos || 0, color: 'sky', path: '/main_box/gallery' },
    { icon: Video, label: 'Videos', value: stats?.total_videos || 0, color: 'purple', path: '/main_box/videos' },
    { icon: Download, label: 'Downloads', value: stats?.total_downloads || 0, color: 'green', path: '/main_box/downloads' },
    { icon: Users, label: 'Faculty', value: stats?.total_faculty || 0, color: 'indigo', path: '/main_box/faculty' },
    { icon: Mail, label: 'Messages', value: stats?.unread_messages || 0, color: 'pink', path: '/main_box/messages' },
  ];

  const colorClasses: Record<string, { bg: string; text: string; iconBg: string }> = {
    orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', iconBg: 'bg-orange-500' },
    red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', iconBg: 'bg-red-500' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-500' },
    sky: { bg: 'bg-sky-50 dark:bg-sky-900/20', text: 'text-sky-600 dark:text-sky-400', iconBg: 'bg-sky-500' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', iconBg: 'bg-purple-500' },
    green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', iconBg: 'bg-green-500' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', iconBg: 'bg-indigo-500' },
    pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400', iconBg: 'bg-pink-500' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's your website overview.</p>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const colors = colorClasses[stat.color];
          return (
            <Link
              key={index}
              to={stat.path}
              className={`${colors.bg} rounded-xl p-6 hover:shadow-lg transition-all group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { icon: FileText, label: 'Add Notice', path: '/main_box/notices/new', color: 'orange' },
              { icon: Calendar, label: 'Add Event', path: '/main_box/events/new', color: 'red' },
              { icon: Images, label: 'Upload Photos', path: '/main_box/gallery', color: 'amber' },
              { icon: FileText, label: 'Edit Homepage', path: '/main_box/homepage', color: 'sky' },
            ].map((action, i) => (
              <Link
                key={i}
                to={action.path}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 group transition-colors"
              >
                <div className={`w-10 h-10 bg-${action.color}-100 dark:bg-${action.color}-900/30 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <action.icon className={`w-5 h-5 text-${action.color}-500`} />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{action.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </Link>
            ))}
          </div>
        </div>

        {/* Storage & Stats */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Storage & Usage</h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">Storage Used</span>
                <span className="font-medium text-slate-900 dark:text-white">{stats?.storage_used_mb || 0} MB</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '15%' }} />
              </div>
              <p className="text-xs text-slate-400 mt-2">Free tier limit: 1 GB</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
                <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{stats?.total_photos || 0}</div>
                <div className="text-xs text-slate-500">Photos</div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{stats?.total_videos || 0}</div>
                <div className="text-xs text-slate-500">Videos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2">
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-medium capitalize">{activity.action}</span>{' '}
                      <span className="text-slate-500">{activity.resource_type}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(activity.created_at)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Welcome Info */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Welcome to Gurukul CMS</h3>
            <p className="text-white/80 text-sm">Manage your school website content easily from this dashboard.</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-white/60 text-xs">Need help?</p>
            <p className="text-white/80 text-sm">Check the documentation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
