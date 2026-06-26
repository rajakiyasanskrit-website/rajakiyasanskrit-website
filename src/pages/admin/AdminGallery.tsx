import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../lib/admin-auth';
import {
  Plus,
  Folder,
  Image,
  Trash2,
  Edit2,
  MoreVertical,
  Check,
  X,
  Upload,
  AlertCircle,
  Loader2,
  Star,
  ArrowLeft,
} from 'lucide-react';

interface Album {
  id: string;
  title_np: string;
  title_en: string | null;
  description_np: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  photos_count: number;
  status: string;
  created_at: string;
}

interface Photo {
  id: string;
  image_url: string;
  caption_np: string | null;
  display_order: number;
}

export default function AdminGallery() {
  const { user } = useAdminAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showNewAlbumModal, setShowNewAlbumModal] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState({ nepali: '', english: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const { data } = await supabase
        .from('cms_albums')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (data) setAlbums(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async (albumId: string) => {
    try {
      const { data } = await supabase
        .from('cms_photos')
        .select('*')
        .eq('album_id', albumId)
        .order('display_order');
      if (data) setPhotos(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createAlbum = async () => {
    if (!newAlbumTitle.nepali.trim()) return;

    try {
      const { data } = await supabase
        .from('cms_albums')
        .insert({
          title_np: newAlbumTitle.nepali,
          title_en: newAlbumTitle.english,
          slug: newAlbumTitle.english?.toLowerCase().replace(/\s+/g, '-') || undefined,
        })
        .select()
        .single();

      if (data) {
        await supabase.from('cms_activity_log').insert({
          user_id: user?.id,
          action: 'create',
          resource_type: 'album',
          resource_title: newAlbumTitle.nepali,
        });
        setShowNewAlbumModal(false);
        setNewAlbumTitle({ nepali: '', english: '' });
        fetchAlbums();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteAlbum = async (albumId: string, title: string) => {
    if (!confirm('Delete this album and all its photos?')) return;

    try {
      await supabase
        .from('cms_albums')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', albumId);

      await supabase.from('cms_activity_log').insert({
        user_id: user?.id,
        action: 'delete',
        resource_type: 'album',
        resource_title: title,
      });
      fetchAlbums();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleFeatured = async (album: Album) => {
    try {
      await supabase
        .from('cms_albums')
        .update({ is_featured: !album.is_featured })
        .eq('id', album.id);
      fetchAlbums();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle file selection for upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, albumId: string) => {
    const files = e.target.files;
    if (!files || !albumId) return;

    setUploading(true);
    try {
      const uploadedPhotos = [];
      for (const file of Array.from(files)) {
        // For demo, use placeholder URLs
        const photoUrl = URL.createObjectURL(file);
        uploadedPhotos.push({
          album_id: albumId,
          image_url: photoUrl,
          caption_np: '',
        });
      }

      if (uploadedPhotos.length > 0) {
        await supabase.from('cms_photos').insert(uploadedPhotos);
        await supabase.from('cms_albums').update({
          photos_count: photos.length + uploadedPhotos.length
        }).eq('id', albumId);

        await supabase.from('cms_activity_log').insert({
          user_id: user?.id,
          action: 'upload',
          resource_type: 'photo',
          details: { album_id: albumId, count: uploadedPhotos.length }
        });

        fetchPhotos(albumId);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (photoId: string) => {
    if (!selectedAlbum) return;
    try {
      await supabase.from('cms_photos').delete().eq('id', photoId);
      await supabase.from('cms_albums').update({
        photos_count: Math.max(0, selectedAlbum.photos_count - 1)
      }).eq('id', selectedAlbum.id);
      fetchPhotos(selectedAlbum.id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  // Photo View for selected album
  if (selectedAlbum) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedAlbum(null)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedAlbum.title_np}</h1>
              {selectedAlbum.title_en && (
                <p className="text-slate-500">{selectedAlbum.title_en}</p>
              )}
            </div>
          </div>
          <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg cursor-pointer hover:shadow-lg">
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            <span>{uploading ? 'Uploading...' : 'Upload Photos'}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e, selectedAlbum.id)}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden group"
            >
              <img
                src={photo.image_url}
                alt={photo.caption_np || 'Photo'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => deletePhoto(photo.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Upload placeholder */}
          <label className="aspect-square bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition-colors">
            <Upload className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            <span className="text-sm text-slate-400 mt-2">Add Photo</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e, selectedAlbum.id)}
              disabled={uploading}
            />
          </label>
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gallery</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage photo albums</p>
        </div>
        <button
          onClick={() => setShowNewAlbumModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>New Album</span>
        </button>
      </div>

      {/* Create Album Modal */}
      {showNewAlbumModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Create New Album</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Title (Nepali)</label>
                <input
                  type="text"
                  value={newAlbumTitle.nepali}
                  onChange={(e) => setNewAlbumTitle({ ...newAlbumTitle, nepali: e.target.value })}
                  placeholder="एल्बमको नाम"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Title (English)</label>
                <input
                  type="text"
                  value={newAlbumTitle.english}
                  onChange={(e) => setNewAlbumTitle({ ...newAlbumTitle, english: e.target.value })}
                  placeholder="Album Name"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewAlbumModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={createAlbum}
                disabled={!newAlbumTitle.nepali.trim()}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Albums Grid */}
      {albums.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => {
                    setSelectedAlbum(album);
                    fetchPhotos(album.id);
                  }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer hover:shadow-lg transition-all"
            >
              {/* Cover */}
              <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 relative">
                {album.cover_image_url ? (
                  <img src={album.cover_image_url} alt={album.title_np} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Folder className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  {album.is_featured && (
                    <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 text-white text-xs rounded-full flex items-center gap-1">
                  <Image className="w-3 h-3" />
                  {album.photos_count}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white truncate">{album.title_np}</h3>
                {album.title_en && <p className="text-sm text-slate-500 truncate">{album.title_en}</p>}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFeatured(album);
                    }}
                    className={`p-2 rounded-lg ${album.is_featured ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAlbum(album.id, album.title_np);
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"
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
          <Folder className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">No albums found</p>
          <button onClick={() => setShowNewAlbumModal(true)} className="mt-4 text-orange-500 hover:text-orange-600 font-medium">
            Create your first album
          </button>
        </div>
      )}
    </div>
  );
}
