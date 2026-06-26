import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Phone,
  Lotus as LotusIcon,
  Home,
  Calendar,
  Image,
  Newspaper,
  BookOpen,
  MapPin,
} from 'lucide-react';

const LotusIconComponent = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2C12 2 8 6 8 10C8 12 10 14 12 14C14 14 16 12 16 10C16 6 12 2 12 2Z" />
    <path d="M12 14C12 14 6 12 4 14C2 16 3 20 6 20C8 20 10 18 12 14Z" />
    <path d="M12 14C12 14 18 12 20 14C22 16 21 20 18 20C16 20 14 18 12 14Z" />
    <path d="M12 14V22" />
  </svg>
);

const MandalaSVG = ({ className = '', size = 100 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={`mandala-rotate ${className}`}>
    <defs>
      <pattern id="mandalaFooter" patternUnits="userSpaceOnUse" width="100" height="100">
        <circle cx="50" cy="50" r="3" className="fill-saffron-400" opacity="0.3" />
      </pattern>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#mandalaFooter)" />
  </svg>
);

const DiyaIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 40 50" className={`diya-glow ${className}`} fill="currentColor">
    <ellipse cx="20" cy="38" rx="16" ry="8" fill="currentColor" opacity="0.9" />
    <ellipse cx="20" cy="35" rx="12" ry="6" className="fill-gold-400" />
    <path d="M18 20 Q18 10 20 5 Q22 10 22 20" className="fill-saffron-400" />
    <circle cx="20" cy="3" r="3" className="fill-gold-400" opacity="0.8" />
  </svg>
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const navItems = [
    { label: 'गृह', href: '/', icon: Home },
    { label: 'परिचय', href: '/about', icon: BookOpen },
    { label: 'कार्यक्रम', href: '/events', icon: Calendar },
    { label: 'ग्यालरी', href: '/gallery', icon: Image },
    { label: 'सूचना', href: '/notices', icon: Newspaper },
  ];

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-cream-50 font-devanagari">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || !isHome ? 'bg-cream-50/95 backdrop-blur-md shadow-lg shadow-sandalwood-200/30' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between h-16 md:h-20 transition-all duration-300 ${scrolled || !isHome ? 'py-2' : 'py-4'}`}>
            <Link to="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-saffron-400 to-maroon-500 rounded-full opacity-20 animate-pulse" />
                <LotusIconComponent className="w-10 h-10 md:w-12 md:h-12 text-saffron-600 relative z-10" />
              </div>
              <div className="flex flex-col">
                <span className={`font-devanagari font-bold transition-all duration-300 ${scrolled || !isHome ? 'text-sm md:text-lg text-sandalwood-900' : 'text-lg md:text-2xl text-white'}`}>
                  राजकीय संस्कृत गुरुकुल
                </span>
                <span className={`font-english italic transition-all duration-300 ${scrolled || !isHome ? 'text-xs text-sandalwood-600' : 'text-sm text-cream-100'}`}>
                  Matihani Gurukul
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`font-devanagari text-sm font-medium transition-all duration-300 hover:text-saffron-500 relative group ${scrolled || !isHome ? 'text-sandalwood-700' : 'text-cream-50'}`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform ${scrolled || !isHome ? 'bg-saffron-500' : 'bg-gold-400'}`} />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link to="/admission" className={`hidden sm:inline-flex font-devanagari text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${scrolled || !isHome ? 'bg-gradient-to-r from-saffron-500 to-maroon-500 text-white shadow-md' : 'bg-white/20 backdrop-blur-sm text-white border border-white/30'}`}>
                भर्ना
              </Link>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg transition-colors">
                {mobileMenuOpen ? <X className={`w-6 h-6 ${scrolled || !isHome ? 'text-sandalwood-900' : 'text-white'}`} /> : <Menu className={`w-6 h-6 ${scrolled || !isHome ? 'text-sandalwood-900' : 'text-white'}`} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-cream-50 border-t border-sandalwood-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navItems.map(item => (
                <Link key={item.href} to={item.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-saffron-50 transition-colors">
                  <item.icon className="w-5 h-5 text-saffron-500" />
                  <span className="font-devanagari text-sandalwood-800">{item.label}</span>
                </Link>
              ))}
              <Link to="/admission" className="flex items-center justify-center gap-2 p-3 mt-4 bg-gradient-to-r from-saffron-500 to-maroon-500 text-white font-devanagari font-semibold rounded-lg">
                भर्ना
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-sandalwood-900 to-sandalwood-950 text-cream-100 py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron-400 via-gold-400 to-maroon-400" />

        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 mandala-rotate">
            <div className="w-full h-full flex items-center justify-center">
              <MandalaSVG size={600} className="text-gold-400" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Sanskrit Quote */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-saffron-500/20 via-gold-500/20 to-maroon-500/20 rounded-full border border-gold-400/30">
              <span className="font-devanagari text-2xl md:text-3xl font-bold text-gold-300" style={{ textShadow: '0 0 20px rgba(212, 165, 116, 0.3)' }}>
                सा विद्या या विमुक्तये
              </span>
            </div>
            <p className="font-english italic text-cream-300 mt-3 text-sm">
              &quot;Education is that which leads to liberation&quot;
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* About */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <LotusIconComponent className="w-8 h-8 text-gold-400" />
                <h3 className="font-devanagari text-xl font-bold">राजकीय संस्कृत गुरुकुल</h3>
              </div>
              <p className="font-devanagari text-cream-300 text-sm leading-relaxed mb-4">
                वि.सं. १७७५ सालमा स्थापित नेपालको पहिलो तथा ऐतिहासिक गुरुकुल। ३०८ वर्षदेखि संस्कृत शिक्षा र सनातन संस्कारको संरक्षण गर्दै।
              </p>
              <div className="flex flex-wrap gap-4">
                {navItems.slice(1).map(item => (
                  <Link key={item.href} to={item.href} className="font-devanagari text-cream-400 hover:text-gold-400 transition-colors text-sm">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-devanagari text-lg font-bold mb-4 text-cream-50">द्रुत लिङ्कहरू</h3>
              <ul className="space-y-2">
                {navItems.map(item => (
                  <li key={item.href}>
                    <Link to={item.href} className="font-devanagari text-cream-300 hover:text-gold-400 transition-colors text-sm flex items-center gap-2">
                      <item.icon className="w-3 h-3" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-devanagari text-lg font-bold mb-4 text-cream-50">सम्पर्क</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-saffron-400 flex-shrink-0 mt-1" />
                  <p className="font-devanagari text-sm text-cream-300">मटिहानी नगरपालिका–७, मधेश प्रदेश</p>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-saffron-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-devanagari text-sm text-cream-300">ईश्वरीप्रसाद पौडेल</p>
                    <a href="tel:+9779844031624" className="font-devanagari text-xs text-saffron-400 hover:text-saffron-300">
                      ९८४४०३१६२४
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-sandalwood-700 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="font-devanagari text-cream-400 text-sm text-center md:text-left">
                © {new Date().getFullYear()} राजकीय संस्कृत गुरुकुल, मटिहानी। सर्वाधिकार सुरक्षित।
              </p>
              <div className="flex items-center gap-2">
                <LotusIconComponent className="w-4 h-4 text-gold-400" />
                <span className="font-english text-xs text-cream-400">Preserving Heritage, Inspiring Futures</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating diyas */}
        <div className="absolute bottom-4 left-10 animate-float opacity-60">
          <DiyaIcon className="w-6 h-8 text-gold-400" />
        </div>
        <div className="absolute bottom-4 right-10 animate-float opacity-60" style={{ animationDelay: '1.5s' }}>
          <DiyaIcon className="w-6 h-8 text-gold-400" />
        </div>
      </footer>
    </div>
  );
}
