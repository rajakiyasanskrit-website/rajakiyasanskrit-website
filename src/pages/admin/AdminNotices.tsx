import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, FileText, Trash2, Edit2, Pin, Star, Search, Loader2 } from 'lucide-react';

interface Notice {
  id: string;
  title_np: string;
  title_en: string | null;
  content_np: string;
  status: string;
  priority: string;
  is_pinned: boolean;
  is_featured: boolean;
  created_at: string;
}

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const { data } = await supabase.from('cms_notices').select('*').is('deleted_at', null).order('created_at', { ascending: false });
    if (data) setNotices(data);
    setLoading(false);
  };

  const deleteNotice = async (id: string) => {
    if (!confirm('यो सूचना मेटाउने हो?')) return;
    await supabase.from('cms_notices').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    fetchNotices();
  };

  const togglePin = async (notice: Notice) => {
    await supabase.from('cms_notices').update({ is_pinned: !notice.is_pinned }).eq('id', notice.id);
    fetchNotices();
  };

  const toggleFeatured = async (notice: Notice) => {
    await supabase.from('cms_notices').update({ is_featured: !notice.is_featured }).eq('id', notice.id);
    fetchNotices();
  };

  const filteredNotices = notices.filter(n => n.title_np.includes(searchQuery));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-devanagari text-3xl font-bold text-sandalwood-900">सूचनाहरू</h1>
          <p className="font-devanagari text-sandalwood-600 mt-1">गुरुकुलका सूचनाहरू</p>
        </div>
        <button onClick={() => navigate('/main_box/notices/new')} className="btn-primary">
          <Plus className="w-5 h-5" />
          <span className="font-devanagari">सूचना थप्नुहोस्</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-sandalwood-200 flex items-center gap-3">
        <Search className="w-5 h-5 text-sandalwood-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="सूचना खोज्नुहोस्..." className="flex-1 bg-transparent border-none outline-none font-devanagari" />
      </div>

      {/* Notices */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500" /></div>
      ) : filteredNotices.length > 0 ? (
        <div className="space-y-3">
          {filteredNotices.map((notice) => (
            <div key={notice.id} className="bg-white rounded-xl border border-sandalwood-200 p-4 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-100 to-gold-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-saffron-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {notice.is_pinned && <Pin className="w-4 h-4 text-orange-500" />}
                    {notice.is_featured && <Star className="w-4 h-4 text-amber-500" />}
                    <span className={`px-2 py-0.5 text-xs rounded-full ${notice.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                      {notice.status}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${notice.priority === 'high' ? 'bg-red-100 text-red-600' : notice.priority === 'low' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-600'}`}>
                      {notice.priority === 'high' ? 'अत्यावश्यक' : notice.priority === 'low' ? 'कम' : 'सामान्य'}
                    </span>
                  </div>
                  <h3 className="font-devanagari font-medium text-sandalwood-900 truncate">{notice.title_np}</h3>
                  {notice.title_en && <p className="text-sm text-sandalwood-500 truncate">{notice.title_en}</p>}
                  <p className="text-xs text-sandalwood-400 mt-1">{new Date(notice.created_at).toLocaleDateString('ne-NP')}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => togglePin(notice)} className={`p-2 rounded-lg ${notice.is_pinned ? 'bg-orange-100 text-orange-600' : 'text-slate-300 hover:bg-slate-100'}`}>
                    <Pin className="w-4 h-4" />
                  </button>
                  <button onClick={() => toggleFeatured(notice)} className={`p-2 rounded-lg ${notice.is_featured ? 'bg-amber-100 text-amber-600' : 'text-slate-300 hover:bg-slate-100'}`}>
                    <Star className="w-4 h-4" />
                  </button>
                  <button onClick={() => navigate(`/main_box/notices/edit/${notice.id}`)} className="p-2 rounded-lg text-slate-300 hover:bg-slate-100 hover:text-sandalwood-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteNotice(notice.id)} className="p-2 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-sandalwood-200">
          <FileText className="w-16 h-16 text-sandalwood-300 mx-auto mb-4" />
          <p className="font-devanagari text-sandalwood-600">कुनै सूचना छैन।</p>
          <button onClick={() => navigate('/main_box/notices/new')} className="mt-4 text-saffron-500 hover:text-saffron-600 font-devanagari font-medium">
            पहिलो सूचना थप्नुहोस्
          </button>
        </div>
      )}
    </div>
  );
}
