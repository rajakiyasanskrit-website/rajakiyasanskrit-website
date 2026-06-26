import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Folder, Image, Trash2, Upload, X, Loader2, ArrowLeft } from 'lucide-react';

interface Album {
  id: string;
  title_np: string;
  title_en: string | null;
  cover_image_url: string | null;
  photos_count: number;
  created_at: string;
}

interface Photo {
  id: string;
  image_url: string;
  caption_np: string | null;
}

export default function AdminGallery() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showNewAlbumModal, setShowNewAlbumModal] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState({ nepali: '', english: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchAlbums(); }, []);

  const fetchAlbums = async () => {
    const { data } = await supabase.from('cms_albums').select('*').is('deleted_at', null).order('created_at', { ascending: false });
    if (data) setAlbums(data);
    setLoading(false);
  };

  const createAlbum = async () => {
    if (!newAlbumTitle.nepali.trim()) return;
    await supabase.from('cms_albums').insert({ title_np: newAlbumTitle.nepali, title_en: newAlbumTitle.english });
    setShowNewAlbumModal(false);
    setNewAlbumTitle({ nepali: '', english: '' });
    fetchAlbums();
  };

  const deleteAlbum = async (albumId: string) => {
    if (!confirm('यो एल्बम र सबै फोटोहरू मेटाउने हो?')) return;
    await supabase.from('cms_albums').update({ deleted_at: new Date().toISOString() }).eq('id', albumId);
    fetchAlbums();
  };

  const selectAlbum = async (album: Album) => {
    setSelectedAlbum(album);
    const { data } = await supabase.from('cms_photos').select('*').eq('album_id', album.id).order('created_at');
    if (data) setPhotos(data);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, albumId: string) => {
    const files = e.target.files;
    if (!files) return;

    const uploadedPhotos = [];
    for (const file of Array.from(files)) {
      uploadedPhotos.push({ album_id: albumId, image_url: URL.createObjectURL(file) });
    }

    if (uploadedPhotos.length > 0) {
      await supabase.from('cms_photos').insert(uploadedPhotos);
      await supabase.from('cms_albums').update({ photos_count: photos.length + uploadedPhotos.length }).eq('id', albumId);
      selectAlbum(selectedAlbum!);
    }
  };

  const deletePhoto = async (photoId: string) => {
    await supabase.from('cms_photos').delete().eq('id', photoId);
    selectAlbum(selectedAlbum!);
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500" /></div>;

  // Photos View
  if (selectedAlbum) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedAlbum(null)} className="flex items-center gap-2 text-sandalwood-600 hover:text-sandalwood-800">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-devanagari">एल्बमहरूमा फर्कनुहोस्</span>
          </button>
          <input type="file" accept="image/*" multiple className="hidden" ref={fileInputRef} onChange={(e) => handleFileUpload(e, selectedAlbum.id)} />
          <button onClick={() => fileInputRef.current?.click()} className="btn-primary">
            <Upload className="w-5 h-5" />
            <span className="font-devanagari">फोटो अपलोड</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <h1 className="font-devanagari text-3xl font-bold text-sandalwood-900">{selectedAlbum.title_np}</h1>
          {selectedAlbum.title_en && <span className="text-sandalwood-400">({selectedAlbum.title_en})</span>}
          <span className="text-sm text-sandalwood-500 ml-2">{photos.length} फोटो</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square bg-sandalwood-100 rounded-xl overflow-hidden group">
              <img src={photo.image_url} alt={photo.caption_np || 'Photo'} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button onClick={() => deletePhoto(photo.id)} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Albums View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-devanagari text-3xl font-bold text-sandalwood-900">ग्यालरी</h1>
          <p className="font-devanagari text-sandalwood-600 mt-1">फोटो एल्बमहरू</p>
        </div>
        <button onClick={() => setShowNewAlbumModal(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          <span className="font-devanagari">एल्बम थप्नुहोस्</span>
        </button>
      </div>

      {/* Create Album Modal */}
      {showNewAlbumModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-saffron-500 rounded-xl flex items-center justify-center">
                <Folder className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-devanagari text-xl font-bold text-sandalwood-900">नयाँ एल्बम</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">एल्बमको नाम (नेपाली) *</label>
                <input type="text" value={newAlbumTitle.nepali} onChange={(e) => setNewAlbumTitle({ ...newAlbumTitle, nepali: e.target.value })} placeholder="एल्बमको नाम" className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 font-devanagari" />
              </div>
              <div>
                <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">Album Name (English)</label>
                <input type="text" value={newAlbumTitle.english} onChange={(e) => setNewAlbumTitle({ ...newAlbumTitle, english: e.target.value })} placeholder="Album Name" className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 font-english" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowNewAlbumModal(false)} className="flex-1 py-3 border border-sandalwood-200 rounded-xl font-devanagari hover:bg-sandalwood-50">रद्द गर्नुहोस्</button>
              <button onClick={createAlbum} disabled={!newAlbumTitle.nepali.trim()} className="flex-1 py-3 bg-gradient-to-r from-gold-500 to-saffron-500 text-white rounded-xl font-devanagari disabled:opacity-50">बनाउनुहोस्</button>
            </div>
          </div>
        </div>
      )}

      {/* Albums Grid */}
      {albums.length > 0 ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map((album) => (
            <div key={album.id} onClick={() => selectAlbum(album)} className="section-card overflow-hidden cursor-pointer group">
              <div className="h-48 bg-gradient-to-br from-sandalwood-100 to-cream-100 relative">
                {album.cover_image_url ? (
                  <img src={album.cover_image_url} alt={album.title_np} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Folder className="w-16 h-16 text-sandalwood-300" /></div>
                )}
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 text-white text-xs rounded-full flex items-center gap-1">
                  <Image className="w-3 h-3" /> {album.photos_count}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-devanagari font-medium text-sandalwood-900 truncate">{album.title_np}</h4>
                    {album.title_en && <p className="text-sm text-sandalwood-400 truncate">{album.title_en}</p>}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteAlbum(album.id); }} className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-sandalwood-200">
          <Folder className="w-16 h-16 text-sandalwood-300 mx-auto mb-4" />
          <p className="font-devanagari text-sandalwood-600">कुनै एल्बम छैन।</p>
          <button onClick={() => setShowNewAlbumModal(true)} className="mt-4 text-saffron-500 hover:text-saffron-600 font-devanagari font-medium">
            पहिलो एल्बम बनाउनुहोस्
          </button>
        </div>
      )}
    </div>
  );
}
