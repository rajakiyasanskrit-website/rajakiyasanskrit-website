import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Loader2, Pin, Star, AlertCircle } from 'lucide-react';

export default function NoticeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title_np: '',
    title_en: '',
    content_np: '',
    content_en: '',
    category: 'general',
    priority: 'normal',
    status: 'draft',
    is_pinned: false,
    is_featured: false,
  });

  useEffect(() => {
    if (isEditing) fetchNotice(id);
  }, [id]);

  const fetchNotice = async (noticeId: string) => {
    const { data, error } = await supabase.from('cms_notices').select('*').eq('id', noticeId).single();
    if (error) {
      setError(`Failed to load notice: ${error.message}`);
    } else if (data) {
      setFormData({
        title_np: data.title_np || '',
        title_en: data.title_en || '',
        content_np: data.content_np || '',
        content_en: data.content_en || '',
        category: data.category || 'general',
        priority: data.priority || 'normal',
        status: data.status || 'draft',
        is_pinned: data.is_pinned || false,
        is_featured: data.is_featured || false,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setError(null);

    if (!formData.title_np) {
      setError('कृपया शीर्षक (नेपाली) भर्नुहोस्।');
      return;
    }
    if (!formData.content_np) {
      setError('कृपया सामग्री (नेपाली) भर्नुहोस्।');
      return;
    }

    setSaving(true);
    try {
      let result;
      if (isEditing) {
        result = await supabase.from('cms_notices').update({ ...formData, updated_at: new Date().toISOString() }).eq('id', id);
      } else {
        result = await supabase.from('cms_notices').insert(formData);
      }

      if (result.error) {
        setError(`Failed to save: ${result.error.message}`);
        console.error('Supabase error:', result.error);
      } else {
        navigate('/main_box/notices');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error: ${errorMessage}`);
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/main_box/notices')} className="flex items-center gap-2 text-sandalwood-600 hover:text-sandalwood-800">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-devanagari">फिर्ता जानुहोस्</span>
        </button>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span className="font-devanagari">{saving ? 'सेभ गर्दै...' : 'सेभ गर्नुहोस्'}</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-devanagari text-red-700 font-medium">त्रुटि!</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="section-card p-6 space-y-5">
        <h2 className="font-devanagari text-xl font-bold text-sandalwood-900">{isEditing ? 'सूचना सम्पादन' : 'नयाँ सूचना'}</h2>

        {/* Title */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">शीर्षक (नेपाली) *</label>
            <input type="text" value={formData.title_np} onChange={(e) => setFormData({ ...formData, title_np: e.target.value })} placeholder="सूचनाको शीर्षक" className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 bg-sandalwood-50/50 font-devanagari" />
          </div>
          <div>
            <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">शीर्षक (English)</label>
            <input type="text" value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} placeholder="Notice Title" className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 bg-sandalwood-50/50 font-english" />
          </div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">सामग्री (नेपाली) *</label>
            <textarea value={formData.content_np} onChange={(e) => setFormData({ ...formData, content_np: e.target.value })} rows={6} placeholder="सूचनाको विस्तृत विवरण..." className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 bg-sandalwood-50/50 font-devanagari resize-none" />
          </div>
          <div>
            <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">सामग्री (English)</label>
            <textarea value={formData.content_en} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} rows={6} placeholder="Detailed notice content..." className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 bg-sandalwood-50/50 font-english resize-none" />
          </div>
        </div>

        {/* Category, Priority, Status */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">श्रेणी</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 bg-sandalwood-50/50 font-devanagari">
              <option value="general">सामान्य</option>
              <option value="admission">भर्ना</option>
              <option value="exam">परीक्षा</option>
              <option value="event">कार्यक्रम</option>
              <option value="holiday">विदा</option>
              <option value="urgent">अत्यावश्यक</option>
            </select>
          </div>
          <div>
            <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">प्राथमिकता</label>
            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 bg-sandalwood-50/50 font-devanagari">
              <option value="low">कम</option>
              <option value="normal">सामान्य</option>
              <option value="high">अत्यावश्यक</option>
            </select>
          </div>
          <div>
            <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">स्थिति</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 bg-sandalwood-50/50 font-devanagari">
              <option value="draft">ड्राफ्ट</option>
              <option value="published">प्रकाशित</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.is_pinned} onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })} className="w-5 h-5 rounded text-saffron-500" />
            <Pin className="w-4 h-4 text-sandalwood-500" />
            <span className="font-devanagari text-sandalwood-700">माथि पिन गर्नुहोस्</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-5 h-5 rounded text-saffron-500" />
            <Star className="w-4 h-4 text-sandalwood-500" />
            <span className="font-devanagari text-sandalwood-700">मुख्य सूचना</span>
          </label>
        </div>
      </div>
    </div>
  );
}
