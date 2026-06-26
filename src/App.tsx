import { useEffect, useRef, useState } from 'react';
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
  Flower2,
} from 'lucide-react';

// Custom Lotus Icon
const LotusIcon = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2C12 2 8 6 8 10C8 12 10 14 12 14C14 14 16 12 16 10C16 6 12 2 12 2Z" />
    <path d="M12 14C12 14 6 12 4 14C2 16 3 20 6 20C8 20 10 18 12 14Z" />
    <path d="M12 14C12 14 18 12 20 14C22 16 21 20 18 20C16 20 14 18 12 14Z" />
    <path d="M12 14V22" />
    <path d="M8 18L12 14L16 18" />
  </svg>
);

// Decorative Elements
const DiyaIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 40 50" className={`diya-glow ${className}`} fill="currentColor">
    <ellipse cx="20" cy="38" rx="16" ry="8" fill="currentColor" opacity="0.9" />
    <ellipse cx="20" cy="35" rx="12" ry="6" className="fill-gold-400" />
    <ellipse cx="20" cy="33" rx="8" ry="4" className="fill-cream-200" />
    <path d="M18 20 Q18 10 20 5 Q22 10 22 20" className="fill-saffron-400" />
    <circle cx="20" cy="3" r="3" className="fill-gold-400" opacity="0.8" />
    <ellipse cx="20" cy="5" rx="2" ry="3" className="fill-gold-300" opacity="0.6" />
  </svg>
);

const MandalaSVG = ({ className = '', size = 100 }: { className?: string; size?: number }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={`mandala-rotate ${className}`}
    style={{ animationDuration: `${60 + Math.random() * 20}s` }}
  >
    <defs>
      <pattern id="mandalaPetals" patternUnits="userSpaceOnUse" width="100" height="100">
        <circle cx="50" cy="50" r="3" className="fill-saffron-400" opacity="0.3" />
        {[...Array(12)].map((_, i) => (
          <ellipse
            key={i}
            cx="50"
            cy="20"
            rx="6"
            ry="15"
            className="fill-none stroke-saffron-400"
            strokeWidth="0.5"
            opacity="0.2"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <ellipse
            key={`p2-${i}`}
            cx="50"
            cy="30"
            rx="8"
            ry="12"
            className="fill-none stroke-gold-400"
            strokeWidth="0.5"
            opacity="0.15"
            transform={`rotate(${i * 45 + 22.5} 50 50)`}
          />
        ))}
      </pattern>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#mandalaPetals)" />
    <circle cx="50" cy="50" r="15" className="fill-gold-400" opacity="0.1" />
  </svg>
);

// Section Reveal Hook
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

// Section Component
const Section = ({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className}`}
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

// Navigation
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream-50/95 backdrop-blur-md shadow-lg shadow-sandalwood-200/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between h-16 md:h-20 transition-all duration-300 ${
            scrolled ? 'py-2' : 'py-4'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <div className="absolute inset-0 bg-gradient-to-br from-saffron-400 to-maroon-500 rounded-full opacity-20 animate-pulse" />
              <LotusIcon className="w-10 h-10 md:w-12 md:h-12 text-saffron-600 relative z-10" />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-devanagari font-bold transition-all duration-300 ${
                  scrolled ? 'text-sm md:text-lg text-sandalwood-900' : 'text-lg md:text-2xl text-white'
                }`}
              >
                राजकीय संस्कृत गुरुकुल
              </span>
              <span
                className={`font-english italic transition-all duration-300 ${
                  scrolled ? 'text-xs text-sandalwood-600' : 'text-sm text-cream-100'
                }`}
              >
                Matihani Gurukul
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'परिचय', href: '#about' },
              { label: 'शिक्षा', href: '#courses' },
              { label: 'आवास', href: '#residential' },
              { label: 'संस्कृति', href: '#culture' },
              { label: 'सम्पर्क', href: '#contact' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`font-devanagari text-sm font-medium transition-all duration-300 hover:text-saffron-500 ${
                  scrolled ? 'text-sandalwood-700' : 'text-cream-50'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <a
            href="#admission"
            className={`font-devanagari text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
              scrolled
                ? 'bg-gradient-to-r from-saffron-500 to-maroon-500 text-white shadow-md'
                : 'bg-white/20 backdrop-blur-sm text-white border border-white/30'
            }`}
          >
            भर्ना
          </a>
        </div>
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-sandalwood-900 via-maroon-900 to-sandalwood-900">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/163314/pexels-photo-163314.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-30" />

      {/* Gradient overlays */}
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
      <div className="absolute top-1/4 left-10 animate-float" style={{ animationDelay: '0s' }}>
        <DiyaIcon className="w-8 h-10 text-gold-500" />
      </div>
      <div className="absolute top-1/3 right-16 animate-float" style={{ animationDelay: '1s' }}>
        <DiyaIcon className="w-8 h-10 text-saffron-500" />
      </div>
      <div className="absolute bottom-1/3 left-24 animate-float" style={{ animationDelay: '2s' }}>
        <DiyaIcon className="w-8 h-10 text-gold-400" />
      </div>
      <div className="absolute bottom-1/4 right-32 animate-float" style={{ animationDelay: '0.5s' }}>
        <DiyaIcon className="w-8 h-10 text-saffron-400" />
      </div>

      {/* Temple silhouette bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-sandalwood-900 to-transparent" />

      {/* Main content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 text-center">
        {/* Decorative top element */}
        <div
          className={`mb-8 transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
        >
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

        {/* Main heading */}
        <h1
          className={`font-devanagari text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 transition-all duration-1000 delay-200 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="text-gradient">उज्ज्वल भविष्यका लागि</span>
          <br />
          <span className="text-cream-50 drop-shadow-lg">प्राचीन गुरुकुल शिक्षा</span>
        </h1>

        {/* Subtext */}
        <p
          className={`font-devanagari text-lg sm:text-xl md:text-2xl text-cream-100 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          वि.सं. १७७५ सालमा स्थापित, <span className="text-gold-400 font-semibold">३०८ वर्ष</span> पुरानो
          राजकीय संस्कृत गुरुकुल —
          <br className="hidden md:block" />
          मधेश प्रदेशको गौरव।
        </p>

        {/* Status badges */}
        <div
          className={`flex flex-wrap items-center justify-center gap-4 mb-10 transition-all duration-1000 delay-500 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <BookOpen className="w-4 h-4 text-saffron-400" />
            <span className="font-devanagari text-sm text-cream-50">कक्षा ८-१२</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Home className="w-4 h-4 text-gold-400" />
            <span className="font-devanagari text-sm text-cream-50">आवासीय गुरुकुल</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <GraduationCap className="w-4 h-4 text-saffron-400" />
            <span className="font-devanagari text-sm text-cream-50">निःशुल्क शिक्षा</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <a href="#admission" className="btn-primary text-lg animate-pulse-glow">
            <Sparkles className="w-5 h-5" />
            <span className="font-devanagari">भर्ना खुला छ</span>
          </a>
          <a href="#about" className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white/20">
            <Scroll className="w-5 h-5" />
            <span className="font-devanagari">थप जान्नुहोस्</span>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-cream-50/60" />
        </div>
      </div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  const stats = [
    { number: '३०८', label: 'वर्ष इतिहास', icon: Building2 },
    { number: '१७७५', label: 'स्थापना (वि.सं.)', icon: Star },
    { number: '५०+', label: 'विद्यार्थी', icon: Users },
    { number: '८-१२', label: 'कक्षाहरू', icon: BookOpen },
  ];

  return (
    <section
      id="about"
      className="py-20 md:py-32 bg-gradient-to-b from-cream-50 via-sandalwood-50 to-cream-50 relative overflow-hidden"
    >
      {/* Decorative mandalas */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10">
          <MandalaSVG size={200} className="text-saffron-500" />
        </div>
        <div className="absolute bottom-10 right-10">
          <MandalaSVG size={150} className="text-maroon-500" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Section>
          {/* Section header */}
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

          {/* Main content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Image placeholder */}
            <div className="relative">
              <div className="section-card p-4 gradient-border">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-sandalwood-200 to-sandalwood-300 flex items-center justify-center">
                  <img
                    src="https://images.pexels.com/photos/2382306/pexels-photo-2382306.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Gurukul Temple"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sandalwood-900/60 via-transparent to-transparent" />

                  {/* Overlaid text */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="font-devanagari text-cream-50 text-sm font-medium">
                      राजकीय संस्कृत गुरुकुल, मटिहानी
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 text-gold-400 opacity-40">
                <MandalaSVG size={80} className="text-gold-400" />
              </div>
              <div className="absolute -bottom-6 -left-6">
                <DiyaIcon className="w-12 h-14 text-saffron-500" />
              </div>
            </div>

            {/* Text content */}
            <div className="space-y-6">
              <p className="font-devanagari text-lg text-sandalwood-800 leading-relaxed">
                <span className="text-gradient font-semibold text-xl">
                  राजकीय संस्कृत गुरुकुल, मटिहानी नगरपालिका–७, मधेश प्रदेश
                </span>{' '}
                अन्तर्गत अवस्थित नेपालको पहिलो तथा ऐतिहासिक गुरुकुल हो। वि.सं. १७७५ सालमा स्थापना भएको यस
                गुरुकुलले ३०८ वर्षदेखि संस्कृत शिक्षा र सनातन संस्कारको दीप प्रज्वलित गर्दै आएको छ।
              </p>
              <p className="font-devanagari text-lg text-sandalwood-700 leading-relaxed">
                महोत्तरी जिल्लाको{' '}
                <span className="text-maroon-600 font-semibold">एक मात्र आवासीय गुरुकुल</span>का रूपमा कक्षा ८
                देखि १२ सम्म अध्ययन गराइन्छ। यस गुरुकुलले मधेश, पहाड तथा उपत्यकाका दलित, जनजाति तथा
                लक्षित वर्गका विद्यार्थीहरूलाई समावेशी रूपमा शिक्षा प्रदान गर्दै आएको छ।
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { icon: GraduationCap, text: 'संस्कृत शिक्षा' },
                  { icon: Home, text: 'निःशुल्क आवास' },
                  { icon: Heart, text: 'समावेशी प्रवेश' },
                  { icon: Users, text: 'गुरु-शिष्य परम्परा' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-saffron-50 rounded-lg border border-saffron-100"
                  >
                    <item.icon className="w-5 h-5 text-saffron-600" />
                    <span className="font-devanagari text-sm font-medium text-sandalwood-800">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="section-card p-6 text-center transform hover:scale-105 transition-all duration-500"
              >
                <stat.icon className="w-10 h-10 text-saffron-500 mx-auto mb-3" />
                <div className="font-devanagari text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="font-devanagari text-sm text-sandalwood-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-sandalwood-100 to-transparent" />
    </section>
  );
};

// Courses Section
const CoursesSection = () => {
  const courses = [
    { title: 'वेद अध्ययन', desc: 'ऋग्वेद, यजुर्वेद, सामवेद — प्राचीन ज्ञानको अध्ययन', icon: BookOpen },
    { title: 'संस्कृत व्याकरण', desc: 'पाणिनीय व्याकरण एवं भाषाको गहन अध्ययन', icon: Scroll },
    { title: 'शास्त्र अध्ययन', desc: 'उपनिषद्, दर्शन, स्मृति साहित्य', icon: GraduationCap },
    { title: 'आधुनिक शिक्षा', desc: 'नेपाली, अंग्रेजी, गणित, विज्ञान', icon: Sparkles },
  ];

  return (
    <section
      id="courses"
      className="py-20 md:py-32 bg-gradient-to-b from-sandalwood-50 to-cream-50 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-mandala-pattern opacity-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Section>
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-maroon-400" />
              <BookOpen className="w-6 h-6 text-maroon-500" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-maroon-400" />
            </div>
            <h2 className="font-devanagari text-4xl md:text-5xl font-bold text-sandalwood-900 mb-4">
              शैक्षिक <span className="text-gradient">कार्यक्रम</span>
            </h2>
            <p className="font-english text-lg text-sandalwood-600 italic">Educational Programs</p>
          </div>

          {/* Intro text */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="font-devanagari text-lg text-sandalwood-700 leading-relaxed">
              यहाँ कक्षा ८ देखि १२ सम्म संस्कृत विषयमा आधारित शिक्षा प्रदान गरिन्छ। परम्परागत वेद, शास्त्र तथा
              आधुनिक विषयहरूको समन्वय गरी विद्यार्थीलाई नैतिक, बौद्धिक तथा आध्यात्मिक रूपमा सक्षम बनाइन्छ।
            </p>
          </div>

          {/* Course cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {courses.map((course, idx) => (
              <div
                key={idx}
                className="section-card p-6 group hover:shadow-xl transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-saffron-400 to-maroon-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <course.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-devanagari text-xl font-bold text-sandalwood-900 mb-2">{course.title}</h3>
                <p className="font-devanagari text-sm text-sandalwood-600">{course.desc}</p>
              </div>
            ))}
          </div>

          {/* Classes info */}
          <div className="section-card p-8 lg:p-12 gradient-border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-devanagari text-2xl font-bold text-sandalwood-900 mb-4">
                  कक्षाहरू — Classes 8 to 12
                </h3>
                <ul className="space-y-3">
                  {[
                    'कक्षा ८: संस्कृत आधारभूत स्तर',
                    'कक्षा ९: व्याकरण एवं साहित्य',
                    'कक्षा १०: वेद परिचय',
                    'कक्षा ११-१२: उच्च माध्यमिक संस्कृत',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-saffron-500" />
                      <span className="font-devanagari text-sandalwood-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-saffron-200 to-gold-200 flex items-center justify-center">
                    <GraduationCap className="w-24 h-24 text-saffron-700" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <MandalaSVG size={60} className="text-gold-400 opacity-60" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </section>
  );
};

// Residential Section
const ResidentialSection = () => {
  return (
    <section
      id="residential"
      className="py-20 md:py-32 bg-gradient-to-b from-cream-50 via-gold-50 to-cream-50 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Section>
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400" />
              <Home className="w-6 h-6 text-gold-500" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400" />
            </div>
            <h2 className="font-devanagari text-4xl md:text-5xl font-bold text-sandalwood-900 mb-4">
              आवासीय <span className="text-gradient">सुविधा</span>
            </h2>
            <p className="font-english text-lg text-sandalwood-600 italic">Residential Life</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="section-card p-4">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Gurukul Students"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sandalwood-900/50 via-transparent to-transparent" />
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -bottom-6 -left-4 bg-white rounded-xl shadow-xl p-4 border border-saffron-100 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron-400 to-gold-500 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-devanagari font-bold text-sandalwood-900">निःशुल्क भोजन</div>
                    <div className="font-devanagari text-xs text-sandalwood-600">Free Meals</div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 border border-saffron-100 animate-float"
                style={{ animationDelay: '1s' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-maroon-400 to-temple-500 flex items-center justify-center">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-devanagari font-bold text-sandalwood-900">निःशुल्क आवास</div>
                    <div className="font-devanagari text-xs text-sandalwood-600">Free Accommodation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 order-1 lg:order-2">
              <p className="font-devanagari text-lg text-sandalwood-800 leading-relaxed">
                गुरुकुलमा विद्यार्थीहरूलाई{' '}
                <span className="text-saffron-600 font-semibold">निःशुल्क भोजन</span> तथा{' '}
                <span className="text-saffron-600 font-semibold">आवास</span>को व्यवस्था गरिएको छ। अनुशासन, सेवा,
                साधना र संस्कारयुक्त जीवनशैलीमार्फत विद्यार्थीहरूको समग्र विकासमा जोड दिइन्छ।
              </p>

              {/* Features */}
              <div className="space-y-4">
                {[
                  { icon: Users, title: 'गुरु-शिष्य परम्परा', desc: 'आचार्यहरूको मार्गदर्शनमा वेद अध्ययन' },
                  { icon: Sparkles, title: 'संस्कार शिक्षा', desc: 'निति, नैतिकता र सदाचार' },
                  { icon: Heart, title: 'समग्र विकास', desc: 'शारीरिक, मानसिक, आध्यात्मिक' },
                  { icon: BookOpen, title: 'दैनिक अनुष्ठान', desc: 'सन्ध्यावन्दना, पूजा-पाठ' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 bg-white/60 rounded-xl border border-gold-100 hover:bg-gold-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-400 to-saffron-500 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-devanagari font-bold text-sandalwood-900">{item.title}</h4>
                      <p className="font-devanagari text-sm text-sandalwood-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </div>
    </section>
  );
};

// Culture Section
const CultureSection = () => {
  return (
    <section
      id="culture"
      className="py-20 md:py-32 bg-gradient-to-b from-sandalwood-900 via-maroon-900 to-sandalwood-900 relative overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-saffron-500/20 to-transparent" />
        <div className="mandala-rotate absolute top-1/2 left-1/4 w-96 h-96 -translate-y-1/2">
          <MandalaSVG size={380} className="text-gold-400" />
        </div>
        <div className="mandala-rotate-reverse absolute top-1/2 right-1/4 w-80 h-80 -translate-y-1/2">
          <MandalaSVG size={320} className="text-saffron-400" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Section>
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400" />
              <LotusIcon className="w-6 h-6 text-gold-400 animate-lotus-bloom" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400" />
            </div>
            <h2 className="font-devanagari text-4xl md:text-5xl font-bold text-cream-50 mb-4">
              संस्कृति र <span className="text-gold-400">सनातन मूल्य</span>
            </h2>
            <p className="font-english text-lg text-cream-200 italic">Culture & Sanatan Values</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Sanatan Dharma */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-gold-400/50 transition-all group">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-saffron-400 to-gold-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-devanagari text-2xl font-bold text-cream-50 mb-4">सनातन धर्म</h3>
              <p className="font-devanagari text-cream-200 leading-relaxed">
                वैदिक परम्परा, धर्मशास्त्र र सनातन सिद्धान्तहरूको अध्ययन। सत्य, अहिंसा, दया र क्षमाको मार्ग।
              </p>
            </div>

            {/* Mithila Culture */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-saffron-400/50 transition-all group">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-maroon-400 to-temple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-devanagari text-2xl font-bold text-cream-50 mb-4">मिथिला संस्कृति</h3>
              <p className="font-devanagari text-cream-200 leading-relaxed">
                मधुबनी कला, मिथिला परम्परा र सांस्कृतिक धरोहरको संरक्षण। पितृ परम्पराको अनुशरण।
              </p>
            </div>

            {/* Sanskrit Tradition */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-saffron-400/50 transition-all group">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-saffron-400 to-maroon-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Scroll className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-devanagari text-2xl font-bold text-cream-50 mb-4">संस्कृत परम्परा</h3>
              <p className="font-devanagari text-cream-200 leading-relaxed">
                देववाणी संस्कृतको संरक्षण र प्रवर्द्धन। वैदिक मन्त्र, स्तोत्र र शास्त्र अध्ययन।
              </p>
            </div>
          </div>

          {/* Image gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.pexels.com/photos/789555/pexels-photo-789555.jpeg?auto=compress&cs=tinysrgb&w=400',
              'https://images.pexels.com/photos/164041/pexels-photo-164041.jpeg?auto=compress&cs=tinysrgb&w=400',
              'https://images.pexels.com/photos/2382306/pexels-photo-2382306.jpeg?auto=compress&cs=tinysrgb&w=400',
              'https://images.pexels.com/photos/5458388/pexels-photo-5458388.jpeg?auto=compress&cs=tinysrgb&w=400',
            ].map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                <img
                  src={img}
                  alt={`Cultural ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sandalwood-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </Section>
      </div>
    </section>
  );
};

// Admission Section
const AdmissionSection = () => {
  return (
    <section
      id="admission"
      className="py-20 md:py-32 bg-gradient-to-b from-cream-50 via-saffron-50 to-cream-50 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 opacity-20">
          <MandalaSVG size={150} className="text-saffron-500" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-15">
          <MandalaSVG size={180} className="text-gold-500" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Section>
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-saffron-400" />
              <GraduationCap className="w-6 h-6 text-saffron-500" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-saffron-400" />
            </div>
            <h2 className="font-devanagari text-4xl md:text-5xl font-bold text-sandalwood-900 mb-4">
              भर्ना <span className="text-gradient">सम्बन्धी जानकारी</span>
            </h2>
            <p className="font-english text-lg text-sandalwood-600 italic">Admission Information</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="section-card p-8 md:p-10 gradient-border">
              <h3 className="font-devanagari text-2xl font-bold text-sandalwood-900 mb-6">भर्ना प्रक्रिया</h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-gold-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    १
                  </div>
                  <div>
                    <h4 className="font-devanagari font-bold text-sandalwood-900 mb-1">आवेदन पत्र भर्नुहोस्</h4>
                    <p className="font-devanagari text-sm text-sandalwood-600">
                      गुरुकुलमा सम्पर्क गरेर आवेदन फारम लिनुहोस्।
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-gold-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    २
                  </div>
                  <div>
                    <h4 className="font-devanagari font-bold text-sandalwood-900 mb-1">आवश्यक कागजात</h4>
                    <p className="font-devanagari text-sm text-sandalwood-600">
                      जन्म प्रमाण पत्र, चारित्रिक प्रमाण पत्र, फोटो।
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-gold-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    ३
                  </div>
                  <div>
                    <h4 className="font-devanagari font-bold text-sandalwood-900 mb-1">अन्तर्वार्ता</h4>
                    <p className="font-devanagari text-sm text-sandalwood-600">विद्यार्थी र अभिभावकको अन्तर्वार्ता।</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-gold-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                    ४
                  </div>
                  <div>
                    <h4 className="font-devanagari font-bold text-sandalwood-900 mb-1">भर्ना स्वीकृति</h4>
                    <p className="font-devanagari text-sm text-sandalwood-600">
                      सफल उम्मेदवारलाई सूचना गरिनेछ।
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-saffron-50 rounded-xl border border-saffron-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-saffron-600 flex-shrink-0 mt-0.5" />
                  <p className="font-devanagari text-sm text-sandalwood-700">
                    <strong>विशेष:</strong> दलित, जनजाति तथा आर्थिक रूपमा विपन्न वर्गका विद्यार्थीहरूलाई
                    प्राथमिकता दिइनेछ।
                  </p>
                </div>
              </div>
            </div>

            {/* Stats card */}
            <div className="space-y-6">
              <div className="section-card p-8">
                <h3 className="font-devanagari text-xl font-bold text-sandalwood-900 mb-6">उपलब्ध सिट</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-saffron-50 to-gold-50 rounded-xl">
                    <span className="font-devanagari text-sandalwood-800">कक्षा ८</span>
                    <span className="font-devanagari text-2xl font-bold text-gradient">३० सिट</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-saffron-50 to-gold-50 rounded-xl">
                    <span className="font-devanagari text-sandalwood-800">कक्षा ९</span>
                    <span className="font-devanagari text-2xl font-bold text-gradient">३० सिट</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-cream-100 rounded-xl border border-cream-200">
                  <p className="font-devanagari text-center text-sandalwood-700">
                    कक्षा १०, ११, १२ मा पनि सिमित सिट उपलब्ध छ।
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <a href="#contact" className="btn-primary text-lg">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-devanagari">अहिले आवेदन दिनुहोस्</span>
                </a>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </section>
  );
};

// Notice Section
const NoticeSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-sandalwood-100 via-temple-50 to-sandalwood-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Section>
          <div className="section-card p-8 border-l-4 border-l-saffron-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-temple-400 to-maroon-500 flex items-center justify-center flex-shrink-0 bell-ring">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-devanagari text-2xl font-bold text-sandalwood-900 mb-4">सूचना</h3>
                <p className="font-devanagari text-sandalwood-700 leading-relaxed mb-4">
                  हाल गुरुकुल क्षेत्रमा सुकुम्बासी तथा अतिक्रमणको समस्या उत्पन्न हुँदा विद्यार्थीहरूमा त्रासको
                  वातावरण सिर्जना भएको छ। यस चुनौतीपूर्ण परिस्थितिमा पनि गुरुकुलले आफ्नो शैक्षिक यात्रा निरन्तर
                  अगाडि बढाइरहेको छ।
                </p>
                <p className="font-devanagari text-sm text-sandalwood-600 italic">
                  गुरुकुलको संरक्षण र संरक्षणमा सबैको साथ अपेक्षित छ।
                </p>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  return (
    <section
      id="contact"
      className="py-20 md:py-32 bg-gradient-to-b from-cream-50 to-sandalwood-100 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-mandala-pattern opacity-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Section>
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-maroon-400" />
              <Phone className="w-6 h-6 text-maroon-500" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-maroon-400" />
            </div>
            <h2 className="font-devanagari text-4xl md:text-5xl font-bold text-sandalwood-900 mb-4">
              सम्पर्क <span className="text-gradient">गर्नुहोस्</span>
            </h2>
            <p className="font-english text-lg text-sandalwood-600 italic">Contact Us</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Card */}
            <div className="section-card p-8 md:p-10 gradient-border">
              <div className="space-y-8">
                {/* Location */}
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-saffron-400 to-gold-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-devanagari text-lg font-bold text-sandalwood-900 mb-2">ठेगाना</h4>
                    <p className="font-devanagari text-sandalwood-700">
                      मटिहानी नगरपालिका–७,
                      <br />
                      महोत्तरी, मधेश प्रदेश
                    </p>
                  </div>
                </div>

                {/* Contact Person */}
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-maroon-400 to-temple-500 flex items-center justify-center flex-shrink-0">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-devanagari text-lg font-bold text-sandalwood-900 mb-2">सम्पर्क व्यक्ति</h4>
                    <p className="font-devanagari text-sandalwood-700">ईश्वरीप्रसाद पौडेल</p>
                    <a
                      href="tel:+9779844031624"
                      className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-saffron-100 text-saffron-700 rounded-lg hover:bg-saffron-200 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="font-devanagari">९८४४०३१६२४</span>
                    </a>
                  </div>
                </div>

                {/* School info */}
                <div className="p-6 bg-sandalwood-50 rounded-xl border border-sandalwood-200">
                  <p className="font-devanagari text-sandalwood-700 text-sm">
                    फोन गर्नुहोस् वा सिधै आएर भर्ना सम्बन्धी जानकारी लिन सक्नुहुन्छ।
                  </p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="section-card p-2 overflow-hidden">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-sandalwood-200 to-sandalwood-300">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14323.781609546286!2d85.88!3d26.87!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDUyJzEyLjAiTiA4NcKwNTInNDguMCJF!5e0!3m2!1sen!2snp!4v1620000000000!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Gurukul Location"
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 pointer-events-none border-4 border-sandalwood-300 rounded-xl" />
              </div>
            </div>
          </div>
        </Section>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-sandalwood-900 to-sandalwood-950 text-cream-100 py-16 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-400 via-gold-400 to-maroon-400" />

      {/* Background mandala */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 mandala-rotate">
          <div className="w-full h-full flex items-center justify-center">
            <MandalaSVG size={600} className="text-gold-400" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Sanskrit quote banner */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-saffron-500/20 via-gold-500/20 to-maroon-500/20 rounded-full border border-gold-400/30">
            <Quote className="w-6 h-6 text-gold-400" />
            <span className="font-devanagari text-2xl md:text-3xl font-bold text-gold-300">
              सा विद्या या विमुक्तये
            </span>
            <Quote className="w-6 h-6 text-gold-400 rotate-180" />
          </div>
          <p className="font-english italic text-cream-300 mt-3 text-sm">
            &quot;Education is that which leads to liberation&quot;
          </p>
        </div>

        {/* Footer content */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <LotusIcon className="w-8 h-8 text-gold-400" />
              <h3 className="font-devanagari text-xl font-bold">राजकीय संस्कृत गुरुकुल</h3>
            </div>
            <p className="font-devanagari text-cream-300 text-sm leading-relaxed">
              वि.सं. १७७५ सालमा स्थापित नेपालको पहिलो तथा ऐतिहासिक गुरुकुल। ३०८ वर्षदेखि संस्कृत शिक्षा र
              सनातन संस्कारको संरक्षण गर्दै।
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-devanagari text-xl font-bold mb-4 text-cream-50">द्रुत लिङ्कहरू</h3>
            <ul className="space-y-2">
              {[
                { label: 'परिचय', href: '#about' },
                { label: 'शैक्षिक कार्यक्रम', href: '#courses' },
                { label: 'भर्ना जानकारी', href: '#admission' },
                { label: 'सम्पर्क', href: '#contact' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-devanagari text-cream-300 hover:text-gold-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-devanagari text-xl font-bold mb-4 text-cream-50">सम्पर्क</h3>
            <div className="space-y-3">
              <p className="font-devanagari text-sm text-cream-300">मटिहानी नगरपालिका–७, मधेश प्रदेश</p>
              <p className="font-devanagari text-sm text-cream-300">सम्पर्क: ईश्वरीप्रसाद पौडेल</p>
              <a
                href="tel:+9779844031624"
                className="inline-flex items-center gap-2 text-saffron-400 hover:text-saffron-300 font-devanagari text-sm"
              >
                <Phone className="w-4 h-4" />
                ९८४४०३१६२४
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-sandalwood-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-devanagari text-cream-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} राजकीय संस्कृत गुरुकुल, मटिहानी। सर्वाधिकार सुरक्षित।
            </p>
            <div className="flex items-center gap-2">
              <LotusIcon className="w-4 h-4 text-gold-400" />
              <span className="font-english text-xs text-cream-400">Preserving Heritage, Inspiring Futures</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating diyas */}
      <div className="absolute bottom-4 left-10 animate-float opacity-60">
        <DiyaIcon className="w-6 h-8 text-gold-400" />
      </div>
      <div
        className="absolute bottom-4 right-10 animate-float opacity-60"
        style={{ animationDelay: '1.5s' }}
      >
        <DiyaIcon className="w-6 h-8 text-gold-400" />
      </div>
    </footer>
  );
};

// Main App
function App() {
  return (
    <div className="min-h-screen bg-cream-50 font-devanagari">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <CoursesSection />
        <ResidentialSection />
        <CultureSection />
        <AdmissionSection />
        <NoticeSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
