import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../lib/admin-auth';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Clock,
  Star,
  Image,
  AlertCircle,
} from 'lucide-react';

interface Event {
  id: string;
  title_np: string;
  title_en: string | null;
  description_np: string | null;
  event_date: string;
  event_time: string | null;
  location_np: string | null;
  category: string;
  status: string;
  is_featured: boolean;
  poster_url: string | null;
  views_count: number;
  created_at: string;
}

const categoryLabels: Record<string, string> = {
  ceremony: 'अनुष्ठान',
  academic: 'शैक्षिक',
  festival: 'उत्सव',
  workshop: 'कार्यशाला',
  sports: 'खेलकुद',
  other: 'अन्य'
};

const statusColors: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  published: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  completed: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  cancelled: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
};

export default function AdminEvents() {
  const { user } = useAdminAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [filterStatus, filterCategory, searchQuery]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('cms_events')
        .select('*')
        .is('deleted_at', null)
        .order('event_date', { ascending: true });

      if (filterStatus !== 'all') query = query.eq('status', filterStatus);
      if (filterCategory !== 'all') query = query.eq('category', filterCategory);
      if (searchQuery) query = query.ilike('title_np', `%${searchQuery}%`);

      const { data } = await query;
      if (data) setEvents(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, title: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await supabase
        .from('cms_events')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', eventId);

      await supabase.from('cms_activity_log').insert({
        user_id: user?.id,
        action: 'delete',
        resource_type: 'event',
        resource_title: title,
      });
      fetchEvents();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleFeature = async (event: Event) => {
    try {
      await supabase
        .from('cms_events')
        .update({ is_featured: !event.is_featured })
        .eq('id', event.id);
      fetchEvents();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Events</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage school events and ceremonies</p>
        </div>
        <button
          onClick={() => navigate('/main_box/events/new')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-64">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="flex-1 bg-transparent border-none outline-none text-slate-700 dark:text-slate-200"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-100 dark:bg-slate-700 border-none rounded-lg px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-100 dark:bg-slate-700 border-none rounded-lg px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Categories</option>
            <option value="ceremony">Ceremony</option>
            <option value="academic">Academic</option>
            <option value="festival">Festival</option>
            <option value="workshop">Workshop</option>
            <option value="sports">Sports</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
        </div>
      ) : events.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Poster */}
              <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 relative">
                {event.poster_url ? (
                  <img src={event.poster_url} alt={event.title_np} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  {event.is_featured && (
                    <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> Featured
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[event.status]}`}>
                    {event.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs text-orange-500 mb-1">{categoryLabels[event.category] || event.category}</p>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{event.title_np}</h3>
                {event.title_en && <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{event.title_en}</p>}

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                  {event.event_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{event.event_time}</span>
                    </div>
                  )}
                </div>
                {event.location_np && (
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{event.location_np}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => toggleFeature(event)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      event.is_featured
                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600'
                    }`}
                  >
                    {event.is_featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => navigate(`/main_box/events/edit/${event.id}`)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id, event.title_np)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">No events found</p>
          <button
            onClick={() => navigate('/main_box/events/new')}
            className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
          >
            Create your first event
          </button>
        </div>
      )}
    </div>
  );
}
