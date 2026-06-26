import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2, CheckCircle, AlertCircle, Palette, Globe, Bell, Shield } from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [settings, setSettings] = useState({
    site_name_np: '',
    site_name_en: '',
    site_tagline_np: '',
    site_tagline_en: '',
    primary_color: '#ff7a11',
    secondary_color: '#c12727',
    show_dark_mode_toggle: true,
    maintenance_mode: false,
    google_analytics_id: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase.from('website_settings').select('*').limit(1).single();
      if (data) {
        setSettings({
          site_name_np: data.site_name_np || '',
          site_name_en: data.site_name_en || '',
          site_tagline_np: data.site_tagline_np || '',
          site_tagline_en: data.site_tagline_en || '',
          primary_color: data.primary_color || '#ff7a11',
          secondary_color: data.secondary_color || '#c12727',
          show_dark_mode_toggle: data.show_dark_mode_toggle ?? true,
          maintenance_mode: data.maintenance_mode ?? false,
          google_analytics_id: data.google_analytics_id || '',
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
    setError('');
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('website_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('id', 'settings-001');

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage website configuration</p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          Settings saved successfully!
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Site Info */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-orange-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Site Information</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Site Name (Nepali)</label>
            <input
              type="text"
              value={settings.site_name_np}
              onChange={(e) => setSettings({ ...settings, site_name_np: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Site Name (English)</label>
            <input
              type="text"
              value={settings.site_name_en}
              onChange={(e) => setSettings({ ...settings, site_name_en: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Tagline (Nepali)</label>
            <input
              type="text"
              value={settings.site_tagline_np}
              onChange={(e) => setSettings({ ...settings, site_tagline_np: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Tagline (English)</label>
            <input
              type="text"
              value={settings.site_tagline_en}
              onChange={(e) => setSettings({ ...settings, site_tagline_en: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-6 h-6 text-orange-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Brand Colors</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primary_color}
                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.primary_color}
                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Secondary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.secondary_color}
                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.secondary_color}
                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-orange-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Features</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.show_dark_mode_toggle}
              onChange={(e) => setSettings({ ...settings, show_dark_mode_toggle: e.target.checked })}
              className="w-5 h-5 rounded text-orange-500"
            />
            <div>
              <span className="text-slate-700 dark:text-slate-300">Show Dark Mode Toggle</span>
              <p className="text-sm text-slate-500">Allow visitors to switch between light and dark themes</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenance_mode}
              onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
              className="w-5 h-5 rounded text-orange-500"
            />
            <div>
              <span className="text-slate-700 dark:text-slate-300">Maintenance Mode</span>
              <p className="text-sm text-slate-500">Show maintenance page to visitors</p>
            </div>
          </label>
        </div>
      </div>

      {/* Analytics */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-orange-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Analytics</h2>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Google Analytics ID</label>
          <input
            type="text"
            value={settings.google_analytics_id}
            onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
            placeholder="G-XXXXXXXXXX"
            className="w-full max-w-md px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  );
}
