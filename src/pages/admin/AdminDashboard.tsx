import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  FileText,
  Calendar,
  Images,
  Video,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface Stats {
  notices: number;
  events: number;
  albums: number;
  photos: number;
  videos: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ notices: 0, events: 0, albums: 0, photos: 0, videos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [notices, events, albums, photos, videos] = await Promise.all([
        supabase.from('cms_notices').select('id', { count: 'exact', head: true }).is('deleted_at', null).eq('status', 'published'),
        supabase.from('cms_events').select('id', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('cms_albums').select('id', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('cms_photos').select('id', { count: 'exact', head: true }),
        supabase.from('cms_videos').select('id', { count: 'exact', head: true }).is('deleted_at', null),
      ]);

      setStats({
        notices: notices.count || 0,
        events: events.count || 0,
        albums: albums.count || 0,
        photos: photos.count || 0,
        videos: videos.count || 0,
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: FileText, label: 'Add Notice', path: '/main_box/notices/new', color: 'saffron' },
    { icon: Calendar, label: 'Add Event', path: '/main_box/events/new', color: 'maroon' },
    { icon: Images, label: 'Add Photos', path: '/main_box/gallery', color: 'gold' },
    { icon: Video, label: 'Add Video', path: '/main_box/videos/new', color: 'temple' },
  ];

  const statCards = [
    { icon: FileText, label: 'Notices', value: stats.notices, color: 'saffron' },
    { icon: Calendar, label: 'Events', value: stats.events, color: 'maroon' },
    { icon: Images, label: 'Albums', value: stats.albums, color: 'gold' },
    { icon: Images, label: 'Photos', value: stats.photos, color: 'sandalwood' },
    { icon: Video, label: 'Videos', value: stats.videos, color: 'temple' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-devanagari text-3xl font-bold text-sandalwood-900">ड्यासबोर्ड</h1>
        <p className="font-devanagari text-sandalwood-600 mt-1">गुरुकुल वेबसाइट म्यानेज गर्नुहोस्</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, i) => (
          <Link
            key={i}
            to={action.path}
            className="section-card p-4 hover:shadow-lg transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${action.color}-400 to-${action.color}-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <p className="font-devanagari font-medium text-sandalwood-800">{action.label}</p>
            <Plus className="w-4 h-4 text-saffron-500 mt-1" />
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="section-card p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-saffron-500" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-sandalwood-900">{stat.value}</div>
            <div className="font-devanagari text-sm text-sandalwood-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Items */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="section-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-devanagari font-bold text-sandalwood-900">हालका सूचनाहरू</h3>
            <Link to="/main_box/notices" className="text-sm text-saffron-500 flex items-center gap-1 hover:text-saffron-600">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="font-devanagari text-sm text-sandalwood-600">सूचनाहरू यहाँ देखिनेछन्...</p>
        </div>

        <div className="section-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-devanagari font-bold text-sandalwood-900">आगामी कार्यक्रमहरू</h3>
            <Link to="/main_box/events" className="text-sm text-saffron-500 flex items-center gap-1 hover:text-saffron-600">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="font-devanagari text-sm text-sandalwood-600">कार्यक्रमहरू यहाँ देखिनेछन्...</p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-saffron-500 via-gold-500 to-saffron-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-devanagari text-xl font-bold mb-1">नयाँ सामग्री थप्नुहोस्</h3>
            <p className="font-devanagari text-white/80 text-sm">सूचना, कार्यक्रम, वा फोटोहरू अपलोड गर्नुहोस्</p>
          </div>
          <div className="flex gap-2">
            <Link to="/main_box/notices/new" className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg font-devanagari text-sm hover:bg-white/30">
              सूचना
            </Link>
            <Link to="/main_box/events/new" className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg font-devanagari text-sm hover:bg-white/30">
              कार्यक्रम
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
