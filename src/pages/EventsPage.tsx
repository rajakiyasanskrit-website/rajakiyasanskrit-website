import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  BookOpen,
  Users,
  Building2,
  Star,
  Bell,
} from 'lucide-react';
import { supabase, type Event } from '../lib/supabase';

const MandalaSVG = ({ className = '', size = 100 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={`mandala-rotate ${className}`}>
    <defs>
      <pattern id="mandalaPattern" patternUnits="userSpaceOnUse" width="100" height="100">
        <circle cx="50" cy="50" r="3" className="fill-saffron-400" opacity="0.3" />
      </pattern>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#mandalaPattern)" />
    <circle cx="50" cy="50" r="15" className="fill-gold-400" opacity="0.1" />
  </svg>
);

const LotusIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2C12 2 8 6 8 10C8 12 10 14 12 14C14 14 16 12 16 10C16 6 12 2 12 2Z" />
    <path d="M12 14C12 14 6 12 4 14C2 16 3 20 6 20C8 20 10 18 12 14Z" />
    <path d="M12 14C12 14 18 12 20 14C22 16 21 20 18 20C16 20 14 18 12 14Z" />
    <path d="M12 14V22" />
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
  return (
    <div ref={ref} className="transition-all duration-1000 ease-out" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const categoryIcons: Record<string, typeof Bell> = { ceremony: Flame, academic: BookOpen, festival: Star, workshop: Users };

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  useEffect(() => {
    const fetchEvents = async () => {
      const now = new Date().toISOString().split('T')[0];
      let query = supabase.from('events').select('*').order('event_date', { ascending: true });
      if (selectedCategory !== 'all') query = query.eq('category', selectedCategory);
      if (selectedYear !== 'all') query = query.gte('event_date', `${selectedYear}-01-01`).lte('event_date', `${selectedYear}-12-31`);

      const { data } = await query;
      if (data) setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, [selectedCategory, selectedYear]);

  const categories = ['all', 'ceremony', 'academic', 'festival', 'workshop'];
  const years = ['all', '2026', '2025', '2024'];
  const upcomingEvents = events.filter(e => e.event_date >= new Date().toISOString().split('T')[0]);

  return (
    <>
      <section className="pt-28 md:pt-36 pb-20 bg-gradient-to-b from-sandalwood-900 via-maroon-900 to-sandalwood-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/163314/pexels-photo-163314.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-sandalwood-900/50 via-transparent to-sandalwood-900" />

        <div className="absolute top-10 left-10 opacity-20"><MandalaSVG size={150} /></div>
        <div className="absolute bottom-10 right-10 opacity-15"><MandalaSVG size={180} /></div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400" />
            <Calendar className="w-8 h-8 text-gold-400" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400" />
          </div>
          <h1 className="font-devanagari text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-gradient">कार्यक्रम</span> तथा उत्सवहरू
          </h1>
          <p className="font-devanagari text-lg text-cream-200 max-w-2xl mx-auto">
            गुरुकुलका परम्परागत अनुष्ठान, शैक्षिक कार्यक्रम तथा सांस्कृतिक उत्सवहरू
          </p>
          <p className="font-english text-sm text-cream-400 italic mt-2">Events & Festivities</p>
        </div>
      </section>

      <section className="py-12 bg-sandalwood-100 border-b border-sandalwood-200">
        <div className="max-w-7xl mx-auto px-4">
          <Section>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-devanagari text-sm text-sandalwood-600 mr-2">श्रेणी:</span>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-devanagari transition-all ${selectedCategory === cat ? 'bg-saffron-500 text-white shadow-lg' : 'bg-white text-sandalwood-700 hover:bg-saffron-50 border border-sandalwood-200'}`}>
                    {cat === 'all' ? 'सबै' : cat === 'ceremony' ? 'अनुष्ठान' : cat === 'academic' ? 'शैक्षिक' : cat === 'festival' ? 'उत्सव' : 'कार्यशाला'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-devanagari text-sm text-sandalwood-600 mr-2">वर्ष:</span>
                {years.map(year => (
                  <button key={year} onClick={() => setSelectedYear(year)} className={`px-4 py-2 rounded-full text-sm font-devanagari transition-all ${selectedYear === year ? 'bg-maroon-500 text-white shadow-lg' : 'bg-white text-sandalwood-700 hover:bg-maroon-50 border border-sandalwood-200'}`}>
                    {year === 'all' ? 'सबै' : year}
                  </button>
                ))}
              </div>
            </div>
          </Section>
        </div>
      </section>

      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-saffron-50 via-gold-50 to-saffron-50">
          <div className="max-w-7xl mx-auto px-4">
            <Section>
              <div className="text-center mb-8">
                <h2 className="font-devanagari text-2xl font-bold text-sandalwood-900">
                  <Star className="w-6 h-6 text-saffron-500 inline-block mr-2" />
                  आगामी कार्यक्रमहरू
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map(event => {
                  const Icon = categoryIcons[event.category] || Bell;
                  return (
                    <div key={event.id} className="section-card p-6 border-t-4 border-t-saffron-500 gradient-border hover:shadow-2xl transition-all duration-500">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-saffron-400 to-gold-500 flex items-center justify-center">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="font-devanagari text-2xl font-bold text-saffron-600">{new Date(event.event_date).getDate()}</div>
                          <div className="font-devanagari text-sm text-sandalwood-500">{new Date(event.event_date).toLocaleDateString('ne-NP', { month: 'short' })}</div>
                        </div>
                      </div>
                      <h3 className="font-devanagari text-xl font-bold text-sandalwood-900 mb-2">{event.title_np}</h3>
                      <p className="font-devanagari text-sm text-sandalwood-600 mb-4 line-clamp-2">{event.description_np}</p>
                      <div className="space-y-2 text-xs text-sandalwood-500">
                        {event.event_time && (<div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /><span className="font-devanagari">{event.event_time}</span></div>)}
                        {event.location && (<div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /><span className="font-devanagari">{event.location}</span></div>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>
        </section>
      )}

      <section className="py-20 bg-gradient-to-b from-cream-50 to-sandalwood-50">
        <div className="max-w-7xl mx-auto px-4">
          <Section>
            <div className="text-center mb-12">
              <h2 className="font-devanagari text-3xl font-bold text-sandalwood-900">सबै कार्यक्रमहरू</h2>
            </div>
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-72 bg-sandalwood-100 animate-pulse rounded-2xl" />)}
              </div>
            ) : events.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event, i) => {
                  const Icon = categoryIcons[event.category] || Bell;
                  const isUpcoming = event.event_date >= new Date().toISOString().split('T')[0];
                  return (
                    <div key={event.id} className="section-card overflow-hidden group hover:shadow-2xl transition-all duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="relative h-48 bg-gradient-to-br from-sandalwood-200 to-cream-200 overflow-hidden">
                        {event.image_url ? (<img src={event.image_url} alt={event.title_np} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-saffron-100 via-gold-100 to-maroon-100">
                            <Icon className="w-20 h-20 text-saffron-200" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-sandalwood-900/60 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="px-3 py-1 bg-gradient-to-r from-saffron-500 to-gold-500 text-white text-xs font-bold rounded-full uppercase font-english shadow-lg">{event.category}</span>
                          {isUpcoming && (<span className="px-3 py-1 bg-gradient-to-r from-maroon-500 to-temple-500 text-white text-xs font-bold rounded-full font-devanagari shadow-lg">आगामी</span>)}
                        </div>
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center shadow-lg">
                          <div className="font-devanagari text-2xl font-bold text-saffron-600">{new Date(event.event_date).getDate()}</div>
                          <div className="font-english text-xs text-sandalwood-500 uppercase">{new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}</div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-devanagari text-xl font-bold text-sandalwood-900 mb-2">{event.title_np}</h3>
                        {event.title_en && (<p className="font-english text-sm text-sandalwood-400 italic mb-2">{event.title_en}</p>)}
                        <p className="font-devanagari text-sm text-sandalwood-600 line-clamp-2 mb-4">{event.description_np || event.description_en}</p>
                        <div className="flex items-center justify-between text-xs text-sandalwood-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="font-devanagari">{new Date(event.event_date).toLocaleDateString('ne-NP')}</span>
                          </div>
                          {event.event_time && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="font-devanagari">{event.event_time}</span>
                            </div>
                          )}
                        </div>
                        {event.location && (
                          <div className="mt-3 pt-3 border-t border-sandalwood-100 flex items-center gap-2 text-xs text-sandalwood-500">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="font-devanagari">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-sandalwood-100 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-sandalwood-300" />
                </div>
                <p className="font-devanagari text-sandalwood-600">यो श्रेणीमा कुनै कार्यक्रम छैन।</p>
              </div>
            )}
          </Section>
        </div>
      </section>

      <section className="py-12 bg-sandalwood-900 text-cream-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="font-devanagari text-xl font-bold text-gold-400 mb-4">कार्यक्रममा सहभागी हुन चाहनुहुन्छ?</h3>
          <p className="font-devanagari text-cream-200 mb-6">गुरुकुलका सबै कार्यक्रमहरूमा आम नागरिकको सहभागिता छ। सम्पर्क गर्नुहोस्।</p>
          <Link to="/#contact" className="btn-primary">
            <span className="font-devanagari">सम्पर्क गर्नुहोस्</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default EventsPage;
