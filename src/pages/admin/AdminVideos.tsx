import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Video, Trash2, Youtube, Loader2 } from 'lucide-react';

interface Video {
  id: string;
  title_np: string;
  title_en: string | null;
  video_url: string;
  thumbnail_url: string | null;
  is_featured: boolean;
  status: string;
  created_at: string;
}

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newVideo, setNewVideo] = useState({
    title_np: '',
    title_en: '',
    video_url: '',
    video_type: 'youtube',
    status: 'published',
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data } = await supabase.from('cms_videos').select('*').is('deleted_at', null).order('created_at', { ascending: false });
    if (data) setVideos(data);
    setLoading(false);
  };

  const addVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title_np || !newVideo.video_url) return;

    setSaving(true);
    try {
      await supabase.from('cms_videos').insert({
        ...newVideo,
        thumbnail_url: getYouTubeThumbnail(newVideo.video_url),
      });
      setShowAddModal(false);
      setNewVideo({ title_np: '', title_en: '', video_url: '', video_type: 'youtube', status: 'published' });
      fetchVideos();
    } finally {
      setSaving(false);
    }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm('यो भिडियो मेटाउने हो?')) return;
    await supabase.from('cms_videos').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    fetchVideos();
  };

  const toggleFeatured = async (video: Video) => {
    await supabase.from('cms_videos').update({ is_featured: !video.is_featured }).eq('id', video.id);
    fetchVideos();
  };

  const getYouTubeThumbnail = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-devanagari text-3xl font-bold text-sandalwood-900">भिडियोहरू</h1>
          <p className="font-devanagari text-sandalwood-600 mt-1">YouTube भिडियोहरू व्यवस्थापन</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          <span className="font-devanagari">भिडियो थप्नुहोस्</span>
        </button>
      </div>

      {/* Add Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-devanagari text-xl font-bold text-sandalwood-900">नयाँ भिडियो</h3>
            </div>
            <form onSubmit={addVideo} className="space-y-4">
              <div>
                <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">शीर्षक (नेपाली) *</label>
                <input type="text" value={newVideo.title_np} onChange={(e) => setNewVideo({ ...newVideo, title_np: e.target.value })} placeholder="भिडियोको नाम" required className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 font-devanagari" />
              </div>
              <div>
                <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">शीर्षक (English)</label>
                <input type="text" value={newVideo.title_en} onChange={(e) => setNewVideo({ ...newVideo, title_en: e.target.value })} placeholder="Video Title" className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 font-english" />
              </div>
              <div>
                <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">YouTube URL *</label>
                <input type="text" value={newVideo.video_url} onChange={(e) => setNewVideo({ ...newVideo, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=xxxxx" required className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 font-english" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-sandalwood-200 rounded-xl font-devanagari hover:bg-sandalwood-50">रद्द गर्नुहोस्</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-devanagari disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  थप्नुहोस्
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Videos Grid */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500" /></div>
      ) : videos.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="section-card overflow-hidden group">
              <div className="relative aspect-video bg-sandalwood-100">
                {video.thumbnail_url ? (
                  <img src={video.thumbnail_url} alt={video.title_np} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-12 h-12 text-sandalwood-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="p-4 bg-red-500 text-white rounded-full">
                    <Youtube className="w-8 h-8" />
                  </a>
                </div>
                <button onClick={() => toggleFeatured(video)} className={`absolute top-2 right-2 p-2 rounded-lg transition-colors ${video.is_featured ? 'bg-amber-500 text-white' : 'bg-white/80 text-sandalwood-600 hover:bg-amber-100'}`}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-devanagari font-medium text-sandalwood-900 truncate">{video.title_np}</h3>
                {video.title_en && <p className="text-sm text-sandalwood-500 truncate">{video.title_en}</p>}
                <div className="flex items-center justify-between mt-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${video.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                    {video.status}
                  </span>
                  <button onClick={() => deleteVideo(video.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-sandalwood-200">
          <Video className="w-16 h-16 text-sandalwood-300 mx-auto mb-4" />
          <p className="font-devanagari text-sandalwood-600">कुनै भिडियो छैन।</p>
          <button onClick={() => setShowAddModal(true)} className="mt-4 text-saffron-500 hover:text-saffron-600 font-devanagari font-medium">
            पहिलो भिडियो थप्नुहोस्
          </button>
        </div>
      )}
    </div>
  );
}
