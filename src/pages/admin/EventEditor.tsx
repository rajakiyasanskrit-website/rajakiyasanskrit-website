import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Eye, Loader2, Upload, Image, X } from 'lucide-react';

export default function EventEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title_np: '',
    title_en: '',
    description_np: '',
    description_en: '',
    event_date: '',
    event_time: '',
    location_np: '',
    category: 'ceremony',
    status: 'draft',
    poster_url: '',
    is_featured: false,
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);

  useEffect(() => {
    if (isEditing) fetchEvent(id);
  }, [id]);

  const fetchEvent = async (eventId: string) => {
    const { data } = await supabase.from('cms_events').select('*').eq('id', eventId).single();
    if (data) {
      setFormData({
        title_np: data.title_np || '',
        title_en: data.title_en || '',
        description_np: data.description_np || '',
        description_en: data.description_en || '',
        event_date: data.event_date || '',
        event_time: data.event_time || '',
        location_np: data.location_np || '',
        category: data.category || 'ceremony',
        status: data.status || 'draft',
        poster_url: data.poster_url || '',
        is_featured: data.is_featured || false,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.title_np || !formData.event_date) {
      alert('कृपया शीर्षक र मिति भर्नुहोस्।');
      return;
    }

    setSaving(true);
    try {
      const eventData = {
        ...formData,
        poster_url: posterFile ? URL.createObjectURL(posterFile) : formData.poster_url,
      };

      if (isEditing) {
        await supabase.from('cms_events').update({ ...eventData, updated_at: new Date().toISOString() }).eq('id', id);
      } else {
        await supabase.from('cms_events').insert(eventData);
      }
      navigate('/main_box/events');
    } catch (error) {
      console.error('Error:', error);
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
        <button onClick={() => navigate('/main_box/events')} className="flex items-center gap-2 text-sandalwood-600 hover:text-sandalwood-800">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-devanagari">फिर्ता जानुहोस्</span>
        </button>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span className="font-devanagari">{saving ? 'सेभ गर्दै...' : 'सेभ गर्नुहोस्'}</span>
        </button>
      </div>

      {/* Form */}
      <div className="section-card p-6 space-y-5">
        <h2 className="font-devanagari text-xl font-bold text-sandalwood-900">{isEditing ? 'कार्यक्रम सम्पादन' : 'नयाँ कार्यक्रम'}</h2>

        {/* Title */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">शीर्षक (नेपाली) *</label>
            <input type="text" value={formData.title_np} onChange={(e) => setFormData({ ...formData, title_np: e.target.value })} placeholder="कार्यक्रमको नाम" className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 bg-sandalwood-50/50 font-devanagari" />
          </div>
          <div>
            <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">शीर्षक (English)</label>
            <input type="text" value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} placeholder="Event Title" className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 bg-sandalwood-50/50 font-english" />
          </div>
        </div>

        {/* Description */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">विवरण (नेपाली)</label>
            <textarea value={formData.description_np} onChange={(e) => setFormData({ ...formData, description_np: e.target.value })} rows={4} placeholder="कार्यक्रमको बारेमा..." className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 bg-sandalwood-50/50 font-devanagari resize-none" />
          </div>
          <div>
            <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">विवरण (English)</label>
            <textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={4} placeholder="About the event..." className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 bg-sandalwood-50/50 font-english resize-none" />
          </div>
        </div>

        {/* Date, Time, Location */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">मिति *</label>
            <input type="date" value={formData.event_date} onChange={(e) => setFormData({ ...formData, event_date: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 bg-sandalwood-50/50" />
          </div>
          <div>
            <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">समय</label>
            <input type="time" value={formData.event_time} onChange={(e) => setFormData({ ...formData, event_time: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 bg-sandalwood-50/50" />
          </div>
          <div>
            <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">स्थान</label>
            <input type="text" value={formData.location_np} onChange={(e) => setFormData({ ...formData, location_np: e.target.value })} placeholder="गुरुकुल मन्दिर" className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 bg-sandalwood-50/50 font-devanagari" />
          </div>
        </div>

        {/* Category & Status */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">श्रेणी</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-sandalwood-200 bg-sandalwood-50/50 font-devanagari">
              <option value="ceremony">अनुष्ठान</option>
              <option value="academic">शैक्षिक</option>
              <option value="festival">उत्सव</option>
              <option value="workshop">कार्यशाला</option>
              <option value="sports">खेलकुद</option>
              <option value="other">अन्य</option>
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

        {/* Poster Upload */}
        <div>
          <label className="block font-devanagari text-sm text-sandalwood-600 mb-2">पोस्टर</label>
          <div className="flex items-start gap-4">
            {(formData.poster_url || posterFile) && (
              <div className="relative w-32 h-40 rounded-xl overflow-hidden bg-sandalwood-100">
                <img src={posterFile ? URL.createObjectURL(posterFile) : formData.poster_url} alt="Poster" className="w-full h-full object-cover" />
                <button onClick={() => { setPosterFile(null); setFormData({ ...formData, poster_url: '' }); }} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><X className="w-3 h-3" /></button>
              </div>
            )}
            <label className="flex-1 h-40 border-2 border-dashed border-sandalwood-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-saffron-400 hover:bg-saffron-50/30 transition-colors">
              <Upload className="w-8 h-8 text-sandalwood-400" />
              <span className="font-devanagari text-sm text-sandalwood-500 mt-2">पोस्टर अपलोड गर्नुहोस्</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setPosterFile(e.target.files?.[0] || null)} />
            </label>
          </div>
        </div>

        {/* Featured Toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-5 h-5 rounded text-saffron-500" />
          <span className="font-devanagari text-sandalwood-700">मुख्य कार्यक्रम (Featured)</span>
        </label>
      </div>
    </div>
  );
}
