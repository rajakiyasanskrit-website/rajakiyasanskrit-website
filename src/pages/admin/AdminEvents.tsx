import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Calendar, Trash2, Edit2, Star, Image } from 'lucide-react';

interface Event {
  id: string;
  title_np: string;
  title_en: string | null;
  event_date: string;
  event_time: string | null;
  location_np: string | null;
  category: string;
  status: string;
  is_featured: boolean;
  poster_url: string | null;
}

const categoryLabels: Record<string, string> = {
  ceremony: 'अनुष्ठान',
  academic: 'शैक्षिक',
  festival: 'उत्सव',
  workshop: 'कार्यशाला',
  sports: 'खेलकुद',
  other: 'अन्य'
};

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase.from('cms_events').select('*').is('deleted_at', null).order('event_date', { ascending: true });
    if (data) setEvents(data);
    setLoading(false);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('यो कार्यक्रम मेटाउने हो?')) return;
    await supabase.from('cms_events').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    fetchEvents();
  };

  const toggleFeatured = async (event: Event) => {
    await supabase.from('cms_events').update({ is_featured: !event.is_featured }).eq('id', event.id);
    fetchEvents();
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-devanagari text-3xl font-bold text-sandalwood-900">कार्यक्रमहरू</h1>
          <p className="font-devanagari text-sandalwood-600 mt-1">गुरुकुलका कार्यक्रमहरू</p>
        </div>
        <button onClick={() => navigate('/main_box/events/new')} className="btn-primary">
          <Plus className="w-5 h-5" />
          <span className="font-devanagari">कार्यक्रम थप्नुहोस्</span>
        </button>
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="section-card overflow-hidden group">
              {/* Poster */}
              <div className="h-40 bg-gradient-to-br from-sandalwood-100 to-cream-100 relative">
                {event.poster_url ? (
                  <img src={event.poster_url} alt={event.title_np} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-10 h-10 text-sandalwood-300" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button onClick={() => toggleFeatured(event)} className={`p-2 rounded-lg transition-colors ${event.is_featured ? 'bg-amber-500 text-white' : 'bg-white/80 text-sandalwood-600 hover:bg-amber-100'}`}>
                    <Star className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs text-saffron-500 mb-1">{categoryLabels[event.category]}</p>
                <h3 className="font-devanagari font-medium text-sandalwood-900 truncate">{event.title_np}</h3>
                {event.title_en && <p className="text-sm text-sandalwood-500 truncate">{event.title_en}</p>}

                <div className="flex items-center gap-4 mt-3 text-xs text-sandalwood-400">
                  <span>{new Date(event.event_date).toLocaleDateString('ne-NP')}</span>
                  {event.event_time && <span>{event.event_time}</span>}
                </div>
                {event.location_np && (
                  <p className="text-xs text-sandalwood-400 mt-1 truncate">{event.location_np}</p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-sandalwood-100">
                  <button onClick={() => navigate(`/main_box/events/edit/${event.id}`)} className="flex-1 py-2 rounded-lg bg-sandalwood-100 hover:bg-sandalwood-200 text-sandalwood-600 font-devanagari text-xs font-medium transition-colors">
                    सम्पादन
                  </button>
                  <button onClick={() => deleteEvent(event.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-sandalwood-200">
          <Calendar className="w-16 h-16 text-sandalwood-300 mx-auto mb-4" />
          <p className="font-devanagari text-sandalwood-600">कुनै कार्यक्रम छैन।</p>
          <button onClick={() => navigate('/main_box/events/new')} className="mt-4 text-saffron-500 hover:text-saffron-600 font-devanagari font-medium">
            पहिलो कार्यक्रम थप्नुहोस्
          </button>
        </div>
      )}
    </div>
  );
}
