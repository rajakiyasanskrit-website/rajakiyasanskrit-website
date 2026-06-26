import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../../lib/admin-auth';
import {
  ArrowLeft,
  Save,
  FileText,
  Upload,
  X,
  CheckCircle,
  Loader2,
  AlertCircle,
  Eye,
} from 'lucide-react';

export default function NoticeEditor() {
  const { user } = useAdminAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title_np: '',
    title_en: '',
    content_np: '',
    content_en: '',
    category: 'general',
    priority: 'normal',
    status: 'draft',
    publish_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    pdf_url: '',
    thumbnail_url: '',
    is_pinned: false,
    is_featured: false,
    meta_title: '',
    meta_description: '',
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    if (isEditing) {
      fetchNotice(id);
    }
  }, [id]);

  const fetchNotice = async (noticeId: string) => {
    try {
      const { data } = await supabase
        .from('cms_notices')
        .select('*')
        .eq('id', noticeId)
        .single();

      if (data) {
        setFormData({
          title_np: data.title_np || '',
          title_en: data.title_en || '',
          content_np: data.content_np || '',
          content_en: data.content_en || '',
          category: data.category || 'general',
          priority: data.priority || 'normal',
          status: data.status || 'draft',
          publish_date: data.publish_date || new Date().toISOString().split('T')[0],
          expiry_date: data.expiry_date || '',
          pdf_url: data.pdf_url || '',
          thumbnail_url: data.thumbnail_url || '',
          is_pinned: data.is_pinned || false,
          is_featured: data.is_featured || false,
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, folder: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Note: In production, you'd upload to Supabase Storage
      // For now, returning a placeholder URL
      return URL.createObjectURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleSave = async (asDraft = false) => {
    if (!formData.title_np.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!formData.content_np.trim()) {
      setError('Please enter content');
      return;
    }

    setSaving(true);
    setError('');

    try {
      let pdfUrl = formData.pdf_url;
      let thumbnailUrl = formData.thumbnail_url;

      if (pdfFile) {
        pdfUrl = await handleFileUpload(pdfFile, 'notices') || '';
      }
      if (thumbnailFile) {
        thumbnailUrl = await handleFileUpload(thumbnailFile, 'notices/thumbnails') || '';
      }

      const noticeData = {
        ...formData,
        status: asDraft ? 'draft' : 'published',
        pdf_url: pdfUrl,
        thumbnail_url: thumbnailUrl,
        author_id: user?.id,
        slug: formData.title_en
          ? formData.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          : undefined,
      };

      let result;
      if (isEditing) {
        result = await supabase
          .from('cms_notices')
          .update({ ...noticeData, updated_at: new Date().toISOString() })
          .eq('id', id);
      } else {
        result = await supabase
          .from('cms_notices')
          .insert(noticeData)
          .select('id')
          .single();
      }

      if (result.error) throw result.error;

      // Log activity
      await supabase.from('cms_activity_log').insert({
        user_id: user?.id,
        action: isEditing ? 'update' : 'create',
        resource_type: 'notice',
        resource_title: formData.title_np,
      });

      navigate('/main_box/notices');
    } catch (error) {
      console.error('Save error:', error);
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const categories = ['general', 'admission', 'exam', 'event', 'holiday', 'urgent', 'other'];
  const priorities = ['low', 'normal', 'high'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/main_box/notices')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Notices</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Eye className="w-5 h-5" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
            <span>{isEditing ? 'Update' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Editor */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          {isEditing ? 'Edit Notice' : 'Create New Notice'}
        </h2>

        {/* Title */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Title (Nepali) *
            </label>
            <input
              type="text"
              value={formData.title_np}
              onChange={(e) => setFormData({ ...formData, title_np: e.target.value })}
              placeholder="सूचनाको शीर्षक"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Title (English)
            </label>
            <input
              type="text"
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              placeholder="Notice Title"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Content (Nepali) *
            </label>
            <textarea
              value={formData.content_np}
              onChange={(e) => setFormData({ ...formData, content_np: e.target.value })}
              placeholder="यहाँ सूचनाको विस्तृत विवरण लेख्नुहोस्..."
              rows={8}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Content (English)
            </label>
            <textarea
              value={formData.content_en}
              onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
              placeholder="Write detailed notice content here..."
              rows={8}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
            />
          </div>
        </div>

        {/* Settings Row */}
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              {priorities.map((pri) => (
                <option key={pri} value={pri} className="capitalize">{pri}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Publish Date
            </label>
            <input
              type="date"
              value={formData.publish_date}
              onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Expiry Date
            </label>
            <input
              type="date"
              value={formData.expiry_date}
              onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_pinned}
              onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-slate-700 dark:text-slate-300">Pin to Top</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-slate-700 dark:text-slate-300">Featured</span>
          </label>
        </div>

        {/* File Uploads */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              PDF Document
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-orange-50 dark:file:bg-orange-900/30 file:text-orange-700 dark:file:text-orange-400 file:px-4 file:py-2"
            />
            {formData.pdf_url && (
              <a href={formData.pdf_url} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-500 hover:text-orange-600 mt-1 inline-flex items-center gap-1">
                <FileText className="w-4 h-4" />
                View Current PDF
              </a>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-orange-50 dark:file:bg-orange-900/30 file:text-orange-700 dark:file:text-orange-400 file:px-4 file:py-2"
            />
            {formData.thumbnail_url && (
              <div className="relative w-20 h-20 mt-2 rounded-lg overflow-hidden group">
                <img src={formData.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* SEO */}
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg space-y-4">
          <h4 className="font-medium text-slate-700 dark:text-slate-300">SEO Settings</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Meta Title</label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="Page title for search engines"
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">Meta Description</label>
              <input
                type="text"
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="Brief description for search results"
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
