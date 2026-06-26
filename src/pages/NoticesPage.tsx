import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  AlertCircle,
  AlertTriangle,
  Info,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Clock,
  Pin,
  Archive,
  Search,
  Filter,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CMSNotice {
  id: string;
  title_np: string;
  title_en: string | null;
  content_np: string;
  content_en: string | null;
  category: string;
  priority: string;
  status: string;
  is_pinned: boolean;
  is_featured: boolean;
  publish_date: string;
  expiry_date: string | null;
  pdf_url: string | null;
  created_at: string;
}

const MandalaSVG = ({ className = '', size = 100 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={`mandala-rotate ${className}`}>
    <defs>
      <pattern id="mandalaNotice" patternUnits="userSpaceOnUse" width="100" height="100">
        <circle cx="50" cy="50" r="3" className="fill-saffron-400" opacity="0.3" />
      </pattern>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#mandalaNotice)" />
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

const priorityConfig = {
  high: {
    icon: AlertTriangle,
    bg: 'bg-gradient-to-r from-temple-500/10 to-maroon-500/10',
    border: 'border-l-temple-500',
    badge: 'bg-gradient-to-r from-temple-500 to-maroon-500',
    text: 'text-temple-600',
    label: 'अत्यावश्यक'
  },
  normal: {
    icon: Bell,
    bg: 'bg-gradient-to-r from-saffron-500/10 to-gold-500/10',
    border: 'border-l-saffron-500',
    badge: 'bg-gradient-to-r from-saffron-500 to-gold-500',
    text: 'text-saffron-600',
    label: 'सामान्य'
  },
  low: {
    icon: Info,
    bg: 'bg-gradient-to-r from-sandalwood-200/50 to-cream-200/50',
    border: 'border-l-sandalwood-400',
    badge: 'bg-sandalwood-400',
    text: 'text-sandalwood-600',
    label: 'जानकारी'
  }
};

const NoticesPage = () => {
  const [notices, setNotices] = useState<CMSNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [expandedNotice, setExpandedNotice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotices = async () => {
      let query = supabase.from('cms_notices').select('*').eq('status', 'published').is('deleted_at', null);
      if (selectedPriority !== 'all') query = query.eq('priority', selectedPriority);
      if (searchQuery) query = query.ilike('title_np', `%${searchQuery}%`);
      const { data } = await query.order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
      if (data) setNotices(data);
      setLoading(false);
    };
    fetchNotices();
  }, [selectedPriority, searchQuery]);

  const activeNotices = notices.filter(n => !n.expiry_date || new Date(n.expiry_date) > new Date());
  const archivedNotices = notices.filter(n => n.expiry_date && new Date(n.expiry_date) <= new Date());
  const pinnedNotices = activeNotices.filter(n => n.is_pinned).slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-20 bg-gradient-to-b from-sandalwood-900 via-maroon-900 to-sandalwood-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2382306/pexels-photo-2382306.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-sandalwood-900/60 via-transparent to-sandalwood-900" />
        <div className="absolute top-10 left-10 opacity-20"><MandalaSVG size={150} /></div>
        <div className="absolute bottom-10 right-10 opacity-15"><MandalaSVG size={180} /></div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400" />
            <Bell className="w-8 h-8 text-gold-400 bell-ring" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400" />
          </div>
          <h1 className="font-devanagari text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-gradient">सूचना पाटी</span>
          </h1>
          <p className="font-devanagari text-lg text-cream-200 max-w-2xl mx-auto">
            गुरुकुलका महत्वपूर्ण सूचनाहरू — भर्ना, परीक्षा, अवकाश र विशेष जानकारी
          </p>
          <p className="font-english text-sm text-cream-400 italic mt-2">Notice Board</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-sandalwood-100 border-b border-sandalwood-200 sticky top-16 md:top-20 z-20">
        <div className="max-w-5xl mx-auto px-4">
          <Section>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="w-4 h-4 text-sandalwood-400 mr-1" />
                {[{ key: 'all', label: 'सबै' }, { key: 'high', label: 'अत्यावश्यक' }, { key: 'normal', label: 'सामान्य' }, { key: 'low', label: 'जानकारी' }].map(p => (
                  <button key={p.key} onClick={() => setSelectedPriority(p.key)} className={`px-4 py-2 rounded-full text-sm font-devanagari transition-all ${selectedPriority === p.key ? p.key === 'high' ? 'bg-temple-500 text-white shadow-lg' : p.key === 'normal' ? 'bg-saffron-500 text-white shadow-lg' : p.key === 'low' ? 'bg-sandalwood-500 text-white shadow-lg' : 'bg-maroon-500 text-white shadow-lg' : 'bg-white text-sandalwood-700 hover:bg-saffron-50 border border-sandalwood-200'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sandalwood-400" />
                <input
                  type="text"
                  placeholder="सूचना खोज्नुहोस्..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-full border border-sandalwood-200 bg-white font-devanagari text-sm focus:outline-none focus:ring-2 focus:ring-saffron-300 w-48"
                />
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* Pinned Notices */}
      {pinnedNotices.length > 0 && (
        <section className="py-8 bg-gradient-to-r from-saffron-50 via-gold-50 to-saffron-50 border-b border-saffron-200">
          <div className="max-w-5xl mx-auto px-4">
            <Section>
              <div className="flex items-center gap-2 mb-4">
                <Pin className="w-5 h-5 text-temple-500" />
                <span className="font-devanagari font-bold text-temple-600">प्रमुख सूचनाहरू</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {pinnedNotices.map(notice => {
                  const config = priorityConfig[notice.priority as keyof typeof priorityConfig] || priorityConfig.normal;
                  return (
                    <div key={notice.id} className={`section-card p-5 ${config.bg} border-l-4 ${config.border} hover:shadow-lg transition-all cursor-pointer`} onClick={() => setExpandedNotice(expandedNotice === notice.id ? null : notice.id)}>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${config.badge} flex items-center justify-center flex-shrink-0`}>
                          <config.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 ${config.badge} text-white text-xs rounded font-english`}>{config.label}</span>
                          </div>
                          <h3 className="font-devanagari font-bold text-sandalwood-900">{notice.title_np}</h3>
                          <p className="font-devanagari text-sm text-sandalwood-600 mt-1 line-clamp-2">{notice.content_np}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>
        </section>
      )}

      {/* All Notices */}
      <section className="py-12 bg-gradient-to-b from-cream-50 to-sandalwood-50">
        <div className="max-w-5xl mx-auto px-4">
          <Section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-devanagari text-2xl font-bold text-sandalwood-900">
                {selectedPriority === 'all' ? 'सबै सूचनाहरू' : selectedPriority === 'high' ? 'अत्यावश्यक सूचनाहरू' : selectedPriority === 'normal' ? 'सामान्य सूचनाहरू' : 'जानकारीमूलक सूचनाहरू'}
              </h2>
              <span className="font-devanagari text-sm text-sandalwood-500">{activeNotices.length} सूचना</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-32 bg-sandalwood-100 animate-pulse rounded-xl" />)}
              </div>
            ) : activeNotices.length > 0 ? (
              <div className="space-y-4">
                {activeNotices.map((notice, i) => {
                  const config = priorityConfig[notice.priority as keyof typeof priorityConfig] || priorityConfig.normal;
                  const isExpanded = expandedNotice === notice.id;
                  return (
                    <div key={notice.id} className={`section-card overflow-hidden ${config.bg} border-l-4 ${config.border} transition-all duration-300 hover:shadow-lg`} style={{ animationDelay: `${i * 50}ms` }}>
                      <div className="p-6 cursor-pointer" onClick={() => setExpandedNotice(isExpanded ? null : notice.id)}>
                        <div className="flex items-start gap-5">
                          <div className={`w-14 h-14 rounded-xl ${config.badge} flex items-center justify-center flex-shrink-0 shadow-md`}>
                            <config.icon className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-3 py-1 ${config.badge} text-white text-xs rounded-full font-english`}>{config.label}</span>
                                  <div className="flex items-center gap-1 text-xs text-sandalwood-400">
                                    <Calendar className="w-3 h-3" />
                                    <span className="font-devanagari">{new Date(notice.created_at).toLocaleDateString('ne-NP')}</span>
                                  </div>
                                </div>
                                <h3 className="font-devanagari text-lg font-bold text-sandalwood-900">{notice.title_np}</h3>
                                {notice.title_en && <p className="font-english text-sm text-sandalwood-400 italic">{notice.title_en}</p>}
                              </div>
                              <button className="p-2 hover:bg-white/50 rounded-full transition-colors flex-shrink-0">
                                {isExpanded ? <ChevronUp className="w-5 h-5 text-sandalwood-400" /> : <ChevronDown className="w-5 h-5 text-sandalwood-400" />}
                              </button>
                            </div>
                            <p className="font-devanagari text-sandalwood-600 mt-2 text-sm leading-relaxed">{isExpanded ? notice.content_np : notice.content_np.slice(0, 120) + (notice.content_np.length > 120 ? '...' : '')}</p>
                            {notice.content_en && isExpanded && <p className="font-english text-sandalwood-500 text-sm mt-2 italic">{notice.content_en}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-sandalwood-100 flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-10 h-10 text-sandalwood-300" />
                </div>
                <p className="font-devanagari text-sandalwood-600">कुनै सूचना भेटिएन।</p>
              </div>
            )}
          </Section>
        </div>
      </section>

      {/* Archived Notices */}
      {archivedNotices.length > 0 && (
        <section className="py-12 bg-sandalwood-100">
          <div className="max-w-5xl mx-auto px-4">
            <Section>
              <details className="group">
                <summary className="flex items-center gap-3 cursor-pointer mb-4">
                  <Archive className="w-5 h-5 text-sandalwood-400" />
                  <span className="font-devanagari font-bold text-sandalwood-600">अभिलेख (समाप्त सूचनाहरू)</span>
                  <ChevronDown className="w-4 h-4 text-sandalwood-400 ml-auto group-open:rotate-180 transition-transform" />
                </summary>
                <div className="space-y-3">
                  {archivedNotices.map(notice => (
                    <div key={notice.id} className="section-card p-4 bg-white/50 opacity-70">
                      <h4 className="font-devanagari font-semibold text-sandalwood-600">{notice.title_np}</h4>
                      <p className="font-devanagari text-sm text-sandalwood-500 line-clamp-1">{notice.content_np}</p>
                      <div className="font-devanagari text-xs text-sandalwood-400 mt-2">समाप्त: {notice.expiry_date ? new Date(notice.expiry_date).toLocaleDateString('ne-NP') : 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </details>
            </Section>
          </div>
        </section>
      )}

      {/* Subscribe CTA */}
      <section className="py-16 bg-gradient-to-b from-sandalwood-900 to-sandalwood-950 text-cream-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Section>
            <Bell className="w-12 h-12 text-gold-400 mx-auto mb-4 bell-ring" />
            <h3 className="font-devanagari text-2xl font-bold text-cream-50 mb-4">सूचनाहरू प्राप्त गर्नुहोस्</h3>
            <p className="font-devanagari text-cream-300 mb-6">
              गुरुकुलका सबै महत्वपूर्ण सूचनाहरू तपाईंको इमेलमा प्राप्त गर्नका लागि फोन गर्नुहोस् वा गुरुकुलमा सम्पर्क गर्नुहोस्।
            </p>
            <Link to="/#contact" className="btn-primary">
              <span className="font-devanagari">सम्पर्क गर्नुहोस्</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Section>
        </div>
      </section>
    </>
  );
};

export default NoticesPage;
