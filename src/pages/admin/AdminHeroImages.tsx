import { useState, useEffect, useRef } from 'react';
import { supabase, WebsiteSettings } from '../../lib/supabase';
import { Image as ImageIcon, Upload, Loader2, Save, Check } from 'lucide-react';

export default function AdminHeroImages() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlot, setActiveSlot] = useState<keyof WebsiteSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('website_settings').select('*').single();
      if (error) throw error;
      if (data) setSettings(data as WebsiteSettings);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length || !activeSlot || !settings) return;
    
    const file = e.target.files[0];
    
    // Instead of real upload to storage for simplicity (since we don't have storage setup configured here),
    // we use a URL object or base64. But real app would upload to supabase storage.
    // Assuming Supabase storage bucket 'public' exists and allows uploads.
    try {
      setSaving(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${activeSlot}-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('gallery').upload(fileName, file);
      
      if (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image. Please ensure storage bucket "gallery" exists and is public.');
        return;
      }
      
      const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(fileName);
      
      const newSettings = { ...settings, [activeSlot]: publicUrlData.publicUrl };
      setSettings(newSettings);
      
      await supabase.from('website_settings').update({ [activeSlot]: publicUrlData.publicUrl }).eq('id', settings.id);
      
      setSuccessMsg('तस्विर सफलतापूर्वक परिवर्तन भयो।');
      setTimeout(() => setSuccessMsg(''), 3000);
      
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setActiveSlot(null);
    }
  };

  const triggerUpload = (slot: keyof WebsiteSettings) => {
    setActiveSlot(slot);
    fileInputRef.current?.click();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500" /></div>;

  const slots = [
    { key: 'home_hero_bg', title: 'गृहपृष्ठ ब्यानर (Home Hero)', desc: 'गृहपृष्ठको सबैभन्दा माथिको पृष्ठभूमि तस्विर' },
    { key: 'home_about_img', title: 'गृहपृष्ठ परिचय (Home About)', desc: 'गृहपृष्ठमा गुरुकुल परिचय खण्डको तस्विर' },
    { key: 'about_hero_bg', title: 'हाम्रो कथा ब्यानर (About Hero)', desc: 'हाम्रो कथा पृष्ठको पृष्ठभूमि तस्विर' },
    { key: 'about_heritage_img', title: 'ऐतिहासिक विरासत (About Heritage)', desc: 'हाम्रो कथा पृष्ठमा रहेको ऐतिहासिक विरासत खण्डको तस्विर' },
    { key: 'gallery_hero_bg', title: 'ग्यालरी ब्यानर (Gallery Hero)', desc: 'ग्यालरी पृष्ठको पृष्ठभूमि तस्विर' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-devanagari text-3xl font-bold text-sandalwood-900">वेबसाइट तस्विरहरू</h1>
          <p className="font-devanagari text-sandalwood-600 mt-1">मुख्य पृष्ठहरूमा प्रयोग हुने तस्विरहरू (Replace only)</p>
        </div>
      </div>
      
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 font-devanagari">
          <Check className="w-5 h-5" />
          {successMsg}
        </div>
      )}

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />

      <div className="bg-white rounded-2xl shadow-sm border border-sandalwood-200 overflow-hidden">
        <div className="p-6 space-y-8">
          {slots.map((slot) => {
            const url = settings?.[slot.key as keyof WebsiteSettings] as string;
            return (
              <div key={slot.key} className="flex flex-col md:flex-row gap-6 items-start pb-8 border-b border-sandalwood-100 last:border-0 last:pb-0">
                <div className="w-full md:w-1/3 space-y-2">
                  <h3 className="font-devanagari font-bold text-lg text-sandalwood-900">{slot.title}</h3>
                  <p className="font-devanagari text-sm text-sandalwood-600">{slot.desc}</p>
                  <p className="text-xs text-sandalwood-400 italic">Note: These images cannot be deleted as they are actively shown on the website, they can only be replaced.</p>
                </div>
                
                <div className="w-full md:w-2/3">
                  <div className="relative aspect-video rounded-xl bg-sandalwood-100 border-2 border-dashed border-sandalwood-200 overflow-hidden group">
                    {url ? (
                      <img src={url} alt={slot.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-sandalwood-400">
                        <ImageIcon className="w-12 h-12 mb-2" />
                        <span className="font-devanagari text-sm">कुनै तस्विर छैन</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button 
                        onClick={() => triggerUpload(slot.key as keyof WebsiteSettings)}
                        disabled={saving}
                        className="bg-white text-sandalwood-900 px-4 py-2 rounded-lg font-devanagari font-medium flex items-center gap-2 hover:bg-sandalwood-50 disabled:opacity-50"
                      >
                        {saving && activeSlot === slot.key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        परिवर्तन गर्नुहोस् (Replace)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
