import { useEffect, useState, useRef } from 'react';
import { Image, X, ChevronLeft, ChevronRight, Grid3X3, Image as ImageIcon, ChevronDown, Heart, Share2 } from 'lucide-react';
import { supabase, type GalleryImage } from '../lib/supabase';
import { Link } from 'react-router-dom';

const MandalaSVG = ({ className = '', size = 100 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={`mandala-rotate ${className}`}>
    <defs>
      <pattern id="mandalaGallery" patternUnits="userSpaceOnUse" width="100" height="100">
        <circle cx="50" cy="50" r="3" className="fill-saffron-400" opacity="0.3" />
      </pattern>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#mandalaGallery)" />
  </svg>
);

const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.05 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
};

const Section = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const { ref, isVisible } = useScrollReveal();
  return (<div ref={ref} className="transition-all duration-1000 ease-out" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transitionDelay: `${delay}ms` }}>{children}</div>);
};

const GalleryPage = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightBoxImage, setLightBoxImage] = useState<GalleryImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');

  useEffect(() => {
    const fetchGallery = async () => {
      let query = supabase.from('gallery').select('*');
      if (selectedCategory !== 'all') query = query.eq('category', selectedCategory);
      const { data } = await query.order('display_order', { ascending: true }).order('created_at', { ascending: false });
      if (data) setImages(data);
      setLoading(false);
    };
    fetchGallery();
  }, [selectedCategory]);

  const categories = ['all', 'temple', 'students', 'ceremony', 'general'];
  const featuredImage = images.find(img => img.is_featured) || images[0];

  // Lightbox navigation
  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!lightBoxImage) return;
    const currentIndex = images.findIndex(img => img.id === lightBoxImage.id);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    setLightBoxImage(images[newIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightBoxImage) return;
      if (e.key === 'Escape') setLightBoxImage(null);
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
      if (e.key === 'ArrowRight') navigateLightbox('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightBoxImage, images]);

  return (
    <>
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-20 bg-gradient-to-b from-sandalwood-900 via-maroon-900 to-sandalwood-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/164041/pexels-photo-164041.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-sandalwood-900/60 via-transparent to-sandalwood-900" />
        <div className="absolute top-10 left-10 opacity-20"><MandalaSVG size={150} /></div>
        <div className="absolute bottom-10 right-10 opacity-15"><MandalaSVG size={180} /></div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400" />
            <Image className="w-8 h-8 text-gold-400" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400" />
          </div>
          <h1 className="font-devanagari text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-gradient">ग्यालरी</span>
          </h1>
          <p className="font-devanagari text-lg text-cream-200 max-w-2xl mx-auto">
            गुरुकुल जीवनका यादगार क्षणहरू — परम्परा, शिक्षा र संस्कृतिका दृश्यहरू
          </p>
          <p className="font-english text-sm text-cream-400 italic mt-2">Memorable Moments</p>
        </div>
      </section>

      {/* Featured Image */}
      {featuredImage && (
        <section className="py-0 bg-sandalwood-900">
          <div className="max-w-7xl mx-auto px-4">
            <Section>
              <div className="relative h-64 md:h-96 rounded-t-3xl overflow-hidden cursor-pointer group" onClick={() => setLightBoxImage(featuredImage)}>
                <img src={featuredImage.image_url} alt={featuredImage.title_np} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-sandalwood-900 via-sandalwood-900/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-gold-500/20 border border-gold-400/30 text-gold-400 text-xs font-english rounded-full backdrop-blur-sm">FEATURED</span>
                  </div>
                  <h2 className="font-devanagari text-2xl md:text-4xl font-bold text-cream-50">{featuredImage.title_np}</h2>
                  {featuredImage.title_en && <p className="font-english text-cream-300 italic">{featuredImage.title_en}</p>}
                  {featuredImage.description_np && <p className="font-devanagari text-cream-200/80 text-sm mt-2 max-w-xl">{featuredImage.description_np}</p>}
                </div>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-6 bg-sandalwood-900 border-b border-sandalwood-700 sticky top-16 md:top-20 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <Section>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-devanagari transition-all ${selectedCategory === cat ? 'bg-gold-500 text-sandalwood-900 font-bold shadow-lg' : 'bg-sandalwood-800 text-cream-200 hover:bg-sandalwood-700'}`}>
                    {cat === 'all' ? 'सबै' : cat === 'temple' ? 'मन्दिर' : cat === 'students' ? 'विद्यार्थी' : cat === 'ceremony' ? 'अनुष्ठान' : 'सामान्य'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 bg-sandalwood-800 rounded-lg p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-saffron-500 text-white' : 'text-cream-300 hover:text-white'}`}>
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('masonry')} className={`p-2 rounded-lg transition-all ${viewMode === 'masonry' ? 'bg-saffron-500 text-white' : 'text-cream-300 hover:text-white'}`}>
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-gradient-to-b from-sandalwood-900 to-sandalwood-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => <div key={i} className="aspect-square bg-sandalwood-800 animate-pulse rounded-xl" />)}
            </div>
          ) : images.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4'}>
              {images.map((image, i) => (
                <div
                  key={image.id}
                  onClick={() => setLightBoxImage(image)}
                  className={`relative overflow-hidden rounded-xl cursor-pointer group ${viewMode === 'masonry' ? 'mb-4 break-inside-avoid' : ''}`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className={viewMode === 'grid' ? 'aspect-square' : ''}>
                    <img src={image.image_url} alt={image.title_np} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-sandalwood-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <h3 className="font-devanagari text-sm font-bold text-cream-50">{image.title_np}</h3>
                    <p className="font-english text-xs text-cream-300">{image.category}</p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                        <Heart className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-sandalwood-800 flex items-center justify-center mx-auto mb-4">
                <Image className="w-10 h-10 text-sandalwood-600" />
              </div>
              <p className="font-devanagari text-cream-300">यो श्रेणीमा फोटो छैन।</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightBoxImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={() => setLightBoxImage(null)}>
          <button onClick={() => setLightBoxImage(null)} className="absolute top-4 right-4 p-2 text-cream-100 hover:text-white bg-sandalwood-900/50 rounded-full backdrop-blur-sm z-10">
            <X className="w-6 h-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-cream-100 hover:text-white bg-sandalwood-900/50 rounded-full backdrop-blur-sm z-10">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-cream-100 hover:text-white bg-sandalwood-900/50 rounded-full backdrop-blur-sm z-10">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-5xl max-h-[90vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img src={lightBoxImage.image_url} alt={lightBoxImage.title_np} className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl" />
            <div className="text-center mt-4">
              <h3 className="font-devanagari text-xl font-bold text-cream-50">{lightBoxImage.title_np}</h3>
              {lightBoxImage.title_en && <p className="font-english text-cream-300 italic">{lightBoxImage.title_en}</p>}
              {lightBoxImage.description_np && <p className="font-devanagari text-cream-200/70 text-sm mt-2">{lightBoxImage.description_np}</p>}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-saffron-500 via-gold-500 to-saffron-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="font-devanagari text-xl font-bold text-white mb-2">फोटो साझा गर्नुहोस्</h3>
          <p className="font-devanagari text-white/80 mb-4">तपाईंसँग गुरुकुलको फोटो छ? हामीलाई पठाउनुहोस्।</p>
          <Link to="/#contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-saffron-600 font-devanagari font-bold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            सम्पर्क गर्नुहोस्
          </Link>
        </div>
      </section>
    </>
  );
};

export default GalleryPage;
