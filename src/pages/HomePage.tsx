import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Home,
  Bell,
  Phone,
  Scroll,
  ChevronDown,
  Sparkles,
  Heart,
  GraduationCap,
  Building2,
  MapPin,
  AlertCircle,
  Quote,
  Star,
  Flame,
  ArrowRight,
  Calendar,
  Image,
  Newspaper,
} from 'lucide-react';
import { supabase, type Event, type GalleryImage, type Notice } from '../lib/supabase';

// Decorative Elements
const DiyaIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 40 50" className={`diya-glow ${className}`} fill="currentColor">
    <ellipse cx="20" cy="38" rx="16" ry="8" fill="currentColor" opacity="0.9" />
    <ellipse cx="20" cy="35" rx="12" ry="6" className="fill-gold-400" />
    <ellipse cx="20" cy="33" rx="8" ry="4" className="fill-cream-200" />
    <path d="M18 20 Q18 10 20 5 Q22 10 22 20" className="fill-saffron-400" />
    <circle cx="20" cy="3" r="3" className="fill-gold-400" opacity="0.8" />
  </svg>
);

const MandalaSVG = ({ className = '', size = 100 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={`mandala-rotate ${className}`}>
    <defs>
      <pattern id="mandalaPetals" patternUnits="userSpaceOnUse" width="100" height="100">
        <circle cx="50" cy="50" r="3" className="fill-saffron-400" opacity="0.3" />
      </pattern>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#mandalaPetals)" />
    <circle cx="50" cy="50" r="15" className="fill-gold-400" opacity="0.1" />
  </svg>
);

const LotusIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2C12 2 8 6 8 10C8 12 10 14 12 14C14 14 16 12 16 10C16 6 12 2 12 2Z" />
    <path d="M12 14C12 14 6 12 4 14C2 16 3 20 6 20C8 20 10 18 12 14Z" />
    <path d="M12 14C12 14 18 12 20 14C22 16 21 20 18 20C16 20 14 18 12 14Z" />
    <path d="M12 14V22" />
    <path d="M8 18L12 14L16 18" />
  </svg>
);

const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

const Section = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className="transition-all duration-1000 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Hero Section
const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-sandalwood-900 via-maroon-900 to-sandalwood-900">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/163314/pexels-photo-163314.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-sandalwood-900/40 via-transparent to-sandalwood-900/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-maroon-900/50 via-transparent to-saffron-900/20" />

      {/* Animated mandalas */}
      <div className="absolute top-20 left-10 opacity-20">
        <MandalaSVG size={120} className="text-saffron-400" />
      </div>
      <div className="absolute top-32 right-20 opacity-15">
        <MandalaSVG size={180} className="text-gold-400" />
      </div>
      <div className="absolute bottom-40 left-1/4 opacity-10">
        <MandalaSVG size={100} className="text-maroon-400" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-15">
        <MandalaSVG size={140} className="text-saffron-300" />
      </div>

      {/* Floating diyas */}
      {[
        { top: '25%', left: '5%', delay: '0s' },
        { top: '33%', right: '8%', delay: '1s' },
        { bottom: '33%', left: '10%', delay: '2s' },
        { bottom: '25%', right: '12%', delay: '0.5s' },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-60"
          style={{ ...pos, animationDelay: pos.delay }}
        >
          <DiyaIcon className="w-8 h-10 text-gold-500" />
        </div>
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-sandalwood-900 to-transparent" />

      <div className="relative z-20 max-w-6xl mx-auto px-4 text-center">
        <div className={`mb-8 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400" />
            <Bell className="w-6 h-6 text-gold-400 bell-ring" />
            <LotusIcon className="w-8 h-8 text-gold-400 animate-lotus-bloom" />
            <Bell className="w-6 h-6 text-gold-400 bell-ring" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400" />
          </div>
          <p className="font-devanagari text-sm md:text-base text-saffron-300 tracking-widest">
            ॐ असतो मा सद्गमय
          </p>
        </div>

        <h1 className={`font-devanagari text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-gradient">उज्ज्वल भविष्यका लागि</span>
          <br />
          <span className="text-cream-50 drop-shadow-lg">प्राचीन गुरुकुल शिक्षा</span>
        </h1>

        <p className={`font-devanagari text-lg sm:text-xl md:text-2xl text-cream-100 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          वि.सं. १७७५ सालमा स्थापित, <span className="text-gold-400 font-semibold">३०८ वर्ष</span> पुरानो राजकीय संस्कृत गुरुकुल — मधेश प्रदेशको गौरव।
        </p>

        <div className={`flex flex-wrap items-center justify-center gap-4 mb-10 transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          {[
            { icon: BookOpen, text: 'कक्षा ८-१२' },
            { icon: Home, text: 'आवासीय गुरुकुल' },
            { icon: GraduationCap, text: 'निःशुल्क शिक्षा' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <item.icon className="w-4 h-4 text-saffron-400" />
              <span className="font-devanagari text-sm text-cream-50">{item.text}</span>
            </div>
          ))}
        </div>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link to="/admission" className="btn-primary text-lg animate-pulse-glow">
            <Sparkles className="w-5 h-5" />
            <span className="font-devanagari">भर्ना खुला छ</span>
          </Link>
          <a href="#about" className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white/20">
            <Scroll className="w-5 h-5" />
            <span className="font-devanagari">थप जान्नुहोस्</span>
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-cream-50/60" />
        </div>
      </div>
    </section>
  );
};

// Quick Links Section
const QuickLinksSection = () => (
  <section className="py-16 bg-gradient-to-b from-sandalwood-50 to-cream-50">
    <div className="max-w-7xl mx-auto px-4">
      <Section>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Calendar, title: 'कार्यक्रमहरू', subtitle: 'Events', desc: 'गुरुकुलका आगामी कार्यक्रम र उत्सवहरू', link: '/events', color: 'saffron' },
            { icon: Image, title: 'ग्यालरी', subtitle: 'Gallery', desc: 'गुरुकुल जीवनका यादगार क्षणहरू', link: '/gallery', color: 'gold' },
            { icon: Newspaper, title: 'सूचना पाटी', subtitle: 'Notice Board', desc: 'महत्वपूर्ण सूचनाहरू', link: '/notices', color: 'maroon' },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className={`group section-card p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-devanagari text-2xl font-bold text-sandalwood-900 mb-1">{item.title}</h3>
              <p className="font-english text-sm text-sandalwood-500 italic mb-3">{item.subtitle}</p>
              <p className="font-devanagari text-sm text-sandalwood-600">{item.desc}</p>
              <div className="mt-4 flex items-center text-saffron-600 font-devanagari text-sm group-hover:gap-3 transition-all">
                हेर्नुहोस् <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  </section>
);

// About Section
const AboutSection = () => {
  const stats = [
    { number: '३०८', label: 'वर्ष इतिहास', icon: Building2 },
    { number: '१७७५', label: 'स्थापना (वि.सं.)', icon: Star },
    { number: '५०+', label: 'विद्यार्थी', icon: Users },
    { number: '८-१२', label: 'कक्षाहरू', icon: BookOpen },
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-gradient-to-b from-cream-50 via-sandalwood-50 to-cream-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10"><MandalaSVG size={200} className="text-saffron-500" /></div>
        <div className="absolute bottom-10 right-10"><MandalaSVG size={150} className="text-maroon-500" /></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Section>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-saffron-400" />
              <LotusIcon className="w-6 h-6 text-saffron-400" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-saffron-400" />
            </div>
            <h2 className="font-devanagari text-4xl md:text-5xl font-bold text-sandalwood-900 mb-4">
              हाम्रो <span className="text-gradient">गुरुकुल</span>को परिचय
            </h2>
            <p className="font-english text-lg text-sandalwood-600 italic">Introduction to Our Gurukul</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative">
              <div className="section-card p-4 gradient-border">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <img src="https://images.pexels.com/photos/2382306/pexels-photo-2382306.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Gurukul Temple" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-sandalwood-900/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="font-devanagari text-cream-50 text-sm font-medium">राजकीय संस्कृत गुरुकुल, मटिहानी</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 text-gold-400 opacity-40"><MandalaSVG size={80} /></div>
              <div className="absolute -bottom-6 -left-6"><DiyaIcon className="w-12 h-14 text-saffron-500" /></div>
            </div>

            <div className="space-y-6">
              <p className="font-devanagari text-lg text-sandalwood-800 leading-relaxed">
                <span className="text-gradient font-semibold text-xl">राजकीय संस्कृत गुरुकुल, मटिहानी नगरपालिका–७, मधेश प्रदेश</span> अन्तर्गत अवस्थित नेपालको पहिलो तथा ऐतिहासिक गुरुकुल हो। वि.सं. १७७५ सालमा स्थापना भएको यस गुरुकुलले ३०८ वर्षदेखि संस्कृत शिक्षा र सनातन संस्कारको दीप प्रज्वलित गर्दै आएको छ।
              </p>
              <p className="font-devanagari text-lg text-sandalwood-700 leading-relaxed">
                महोत्तरी जिल्लाको <span className="text-maroon-600 font-semibold">एक मात्र आवासीय गुरुकुल</span>का रूपमा कक्षा ८ देखि १२ सम्म अध्ययन गराइन्छ। यस गुरुकुलले मधेश, पहाड तथा उपत्यकाका दलित, जनजाति तथा लक्षित वर्गका विद्यार्थीहरूलाई समावेशी रूपमा शिक्षा प्रदान गर्दै आएको छ।
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: GraduationCap, text: 'संस्कृत शिक्षा' },
                  { icon: Home, text: 'निःशुल्क आवास' },
                  { icon: Heart, text: 'समावेशी प्रवेश' },
                  { icon: Users, text: 'गुरु-शिष्य परम्परा' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-saffron-50 rounded-lg border border-saffron-100">
                    <item.icon className="w-5 h-5 text-saffron-600" />
                    <span className="font-devanagari text-sm font-medium text-sandalwood-800">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="section-card p-6 text-center transform hover:scale-105 transition-all duration-500">
                <stat.icon className="w-10 h-10 text-saffron-500 mx-auto mb-3" />
                <div className="font-devanagari text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.number}</div>
                <div className="font-devanagari text-sm text-sandalwood-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </section>
  );
};

// Upcoming Events Preview
const EventsPreview = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('is_featured', true)
        .order('event_date', { ascending: true })
        .limit(3);
      if (data) setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-cream-50 to-sandalwood-100">
      <div className="max-w-7xl mx-auto px-4">
        <Section>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-saffron-400" />
              <Calendar className="w-6 h-6 text-saffron-500" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-saffron-400" />
            </div>
            <h2 className="font-devanagari text-4xl font-bold text-sandalwood-900 mb-2">
              आगामी <span className="text-gradient">कार्यक्रमहरू</span>
            </h2>
            <p className="font-english text-sandalwood-600 italic">Upcoming Events</p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-sandalwood-100 animate-pulse rounded-2xl" />)}
            </div>
          ) : events.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {events.map(event => (
                <div key={event.id} className="section-card overflow-hidden group hover:shadow-2xl transition-all duration-500">
                  <div className="relative h-48 bg-gradient-to-br from-saffron-100 to-gold-100 overflow-hidden">
                    {event.image_url ? (
                      <img src={event.image_url} alt={event.title_np} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Bell className="w-16 h-16 text-saffron-200" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-sandalwood-900/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-saffron-500 text-white text-xs font-bold rounded-full uppercase font-english">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="font-devanagari text-xs text-saffron-600 mb-2">
                      {new Date(event.event_date).toLocaleDateString('ne-NP', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h3 className="font-devanagari text-xl font-bold text-sandalwood-900 mb-2">{event.title_np}</h3>
                    <p className="font-devanagari text-sm text-sandalwood-600 line-clamp-2">{event.description_np || event.title_en}</p>
                    {event.location && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-sandalwood-500">
                        <MapPin className="w-4 h-4" />
                        <span className="font-devanagari">{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sandalwood-600 font-devanagari">कुनै आगामी कार्यक्रम छैन।</p>
          )}

          <div className="text-center mt-8">
            <Link to="/events" className="btn-secondary">
              <span className="font-devanagari">सबै कार्यक्रम हेर्नुहोस्</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Section>
      </div>
    </section>
  );
};

// Recent Notices Preview
const NoticesPreview = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      const { data } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2);
      if (data) setNotices(data);
      setLoading(false);
    };
    fetchNotices();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-sandalwood-100 via-cream-50 to-sandalwood-50">
      <div className="max-w-4xl mx-auto px-4">
        <Section>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-maroon-400" />
              <AlertCircle className="w-6 h-6 text-maroon-500" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-maroon-400" />
            </div>
            <h2 className="font-devanagari text-4xl font-bold text-sandalwood-900 mb-2">
              महत्वपूर्ण <span className="text-gradient">सूचनाहरू</span>
            </h2>
            <p className="font-english text-sandalwood-600 italic">Important Notices</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <div key={i} className="h-32 bg-sandalwood-100 animate-pulse rounded-xl" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map(notice => (
                <Link key={notice.id} to="/notices" className="block">
                  <div className={`section-card p-6 border-l-4 ${notice.priority === 'high' ? 'border-l-saffron-500' : 'border-l-gold-400'} hover:shadow-lg transition-all`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${notice.priority === 'high' ? 'bg-saffron-100' : 'bg-gold-100'}`}>
                        <Bell className={`w-5 h-5 ${notice.priority === 'high' ? 'text-saffron-600' : 'text-gold-600'} bell-ring`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-devanagari text-lg font-bold text-sandalwood-900">{notice.title_np}</h3>
                          {notice.priority === 'high' && (
                            <span className="px-2 py-0.5 bg-saffron-500 text-white text-xs rounded font-english">NEW</span>
                          )}
                        </div>
                        <p className="font-devanagari text-sm text-sandalwood-600 line-clamp-2">{notice.content_np}</p>
                        <div className="mt-2 text-xs text-sandalwood-400 font-devanagari">
                          {new Date(notice.created_at).toLocaleDateString('ne-NP')}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/notices" className="btn-secondary border-maroon-200 text-maroon-700 hover:bg-maroon-50">
              <span className="font-devanagari">सबै सूचना हेर्नुहोस्</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Section>
      </div>
    </section>
  );
};

// Contact Preview
const ContactPreview = () => (
  <section className="py-20 bg-gradient-to-b from-sandalwood-900 to-sandalwood-950 text-cream-100 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10 mandala-rotate">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <MandalaSVG size={600} className="text-gold-400" />
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 relative">
      <Section>
        <div className="text-center mb-12">
          <h2 className="font-devanagari text-4xl font-bold text-cream-50 mb-4">
            <span className="text-gold-400">सम्पर्क</span> गर्नुहोस्
          </h2>
          <p className="font-english text-cream-300 italic">Contact Us</p>
        </div>

        <div className="section-card bg-white/5 backdrop-blur-sm border-white/10 p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-saffron-400 to-gold-500 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-devanagari font-bold text-cream-50 mb-1">ठेगाना</h4>
                  <p className="font-devanagari text-cream-200 text-sm">मटिहानी नगरपालिका–७, महोत्तरी, मधेश प्रदेश</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-maroon-400 to-temple-500 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="font-devanagari font-bold text-cream-50 mb-1">सम्पर्क व्यक्ति</h4>
                  <p className="font-devanagari text-cream-200 text-sm">ईश्वरीप्रसाद पौडेल</p>
                  <a href="tel:+9779844031624" className="inline-flex items-center gap-2 mt-2 text-saffron-400 hover:text-saffron-300">
                    <Phone className="w-4 h-4" />
                    <span className="font-devanagari">९८४४०३१६२४</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron-500 to-gold-500 rounded-full text-white font-devanagari font-bold mb-4">
                  <Bell className="w-5 h-5 bell-ring" />
                  भर्ना खुला छ
                </div>
                <p className="font-devanagari text-cream-300 text-sm">कक्षा ८ र ९ मा सिमित सिट उपलब्ध</p>
                <Link to="/admission" className="inline-flex items-center gap-2 mt-4 text-gold-400 hover:text-gold-300 font-devanagari">
                  आवेदन दिनुहोस् <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  </section>
);

// Main HomePage Component
const HomePage = () => {
  return (
    <>
      <HeroSection />
      <QuickLinksSection />
      <AboutSection />
      <EventsPreview />
      <NoticesPreview />
      <ContactPreview />
    </>
  );
};

export default HomePage;
