import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2, CheckCircle, AlertCircle, Home, Upload, X, Image } from 'lucide-react';

export default function AdminHomepage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState({
    hero_title_np: '',
    hero_title_en: '',
    hero_subtitle_np: '',
    hero_subtitle_en: '',
    hero_image_url: '',
    hero_show_admission_cta: true,
    principal_name_np: '',
    principal_name_en: '',
    principal_message_np: '',
    principal_message_en: '',
    principal_image_url: '',
    about_title_np: '',
    about_content_np: '',
    about_image_url: '',
    footer_quote: '',
    footer_address_np: '',
    contact_phone: '',
    contact_email: '',
    social_facebook: '',
    social_youtube: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase.from('homepage_settings').select('*').limit(1).maybeSingle();
      if (data) {
        setSettings({
          hero_title_np: data.hero_title_np || '',
          hero_title_en: data.hero_title_en || '',
          hero_subtitle_np: data.hero_subtitle_np || '',
          hero_subtitle_en: data.hero_subtitle_en || '',
          hero_image_url: data.hero_image_url || '',
          hero_show_admission_cta: data.hero_show_admission_cta ?? true,
          principal_name_np: data.principal_name_np || '',
          principal_name_en: data.principal_name_en || '',
          principal_message_np: data.principal_message_np || '',
          principal_message_en: data.principal_message_en || '',
          principal_image_url: data.principal_image_url || '',
          about_title_np: data.about_title_np || '',
          about_content_np: data.about_content_np || '',
          about_image_url: data.about_image_url || '',
          footer_quote: data.footer_quote || '',
          footer_address_np: data.footer_address_np || '',
          contact_phone: data.contact_phone || '',
          contact_email: data.contact_email || '',
          social_facebook: data.social_facebook || '',
          social_youtube: data.social_youtube || '',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('homepage_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .not.is('id', null)
        .limit(1);

      if (!error) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Placeholder - in production would upload to Supabase Storage
      const url = URL.createObjectURL(file);
      setSettings({ ...settings, [field]: url });
    }
  };

  if (loading) {
    return (<div className="flex items-center justify-center min-h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" /></div>);
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Homepage</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Edit homepage content</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          Changes saved successfully!
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Home className="w-6 h-6 text-orange-500" />
          <h2 className="text-lg font-semibold">Hero Section</h2>
        </div>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title (Nepali)</label>
              <input type="text" value={settings.hero_title_np} onChange={(e) => setSettings({ ...settings, hero_title_np: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title (English)</label>
              <input type="text" value={settings.hero_title_en} onChange={(e) => setSettings({ ...settings, hero_title_en: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle (Nepali)</label>
              <textarea value={settings.hero_subtitle_np} onChange={(e) => setSettings({ ...settings, hero_subtitle_np: e.target.value })} rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle (English)</label>
              <textarea value={settings.hero_subtitle_en} onChange={(e) => setSettings({ ...settings, hero_subtitle_en: e.target.value })} rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 resize-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hero Background Image</label>
            <div className="flex items-center gap-4">
              {settings.hero_image_url && (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden">
                  <img src={settings.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
                  <button onClick={() => setSettings({ ...settings, hero_image_url: '' })} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full"><X className="w-3 h-3" /></button>
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-orange-400">
                <Upload className="w-4 h-4" />
                <span className="text-sm">Upload Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload('hero_image_url')} />
              </label>
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.hero_show_admission_cta} onChange={(e) => setSettings({ ...settings, hero_show_admission_cta: e.target.checked })} className="w-5 h-5 rounded text-orange-500" />
            <span>Show Admission CTA Button</span>
          </label>
        </div>
      </div>

      {/* Principal Message */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold mb-6">Principal Message</h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name (Nepali)</label>
              <input type="text" value={settings.principal_name_np} onChange={(e) => setSettings({ ...settings, principal_name_np: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Name (English)</label>
              <input type="text" value={settings.principal_name_en} onChange={(e) => setSettings({ ...settings, principal_name_en: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Message (Nepali)</label>
              <textarea value={settings.principal_message_np} onChange={(e) => setSettings({ ...settings, principal_message_np: e.target.value })} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message (English)</label>
              <textarea value={settings.principal_message_en} onChange={(e) => setSettings({ ...settings, principal_message_en: e.target.value })} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 resize-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold mb-6">Footer & Contact</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Sanskrit Quote</label>
            <input type="text" value={settings.footer_quote} onChange={(e) => setSettings({ ...settings, footer_quote: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input type="text" value={settings.footer_address_np} onChange={(e) => setSettings({ ...settings, footer_address_np: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input type="text" value={settings.contact_phone} onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" value={settings.contact_email} onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Facebook URL</label>
            <input type="url" value={settings.social_facebook} onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">YouTube URL</label>
            <input type="url" value={settings.social_youtube} onChange={(e) => setSettings({ ...settings, social_youtube: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" />
          </div>
        </div>
      </div>

      {/* Save Button Bottom */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>
    </div>
  );
}
