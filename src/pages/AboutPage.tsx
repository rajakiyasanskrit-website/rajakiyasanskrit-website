import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Star,
  Users,
  BookOpen,
  LotusIcon,
  Heart,
  Home,
  GraduationCap,
  Scroll,
  Flame,
  Sparkles,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react';

const MandalaSVG = ({ className = '', size = 100 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={`mandala-rotate ${className}`}>
    <defs>
      <pattern id="mandalaAbout" patternUnits="userSpaceOnUse" width="100" height="100">
        <circle cx="50" cy="50" r="3" className="fill-saffron-400" opacity="0.3" />
      </pattern>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#mandalaAbout)" />
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

const LotusIconComponent = ({ className = '' }: { className?: string }) => (
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
  return (<div ref={ref} className="transition-all duration-1000 ease-out" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transitionDelay: `${delay}ms` }}>{children}</div>);
};

const AboutPage = () => {
  const timeline = [
    { year: '१७७५', yearEn: '1775 BS', title: 'स्थापना', desc: 'राजा रणबहादुर शाहबाट राजकीय मान्यता प्राप्त। वेद शिक्षा र आचार्य परम्पराको सुरुवात।' },
    { year: '१९००', yearEn: '1843 AD', title: 'संस्कृत शिक्षा विस्तार', desc: 'व्याकरण, न्याय, र मीमांसा शास्त्रको अध्ययन सुरु।' },
    { year: '२०००', yearEn: '1943 AD', title: 'आर्थिक संरचना', desc: 'राज्यबाट लाखेराज तथा जग्गा प्राप्त। गुरुकुल स्वस्थ हुँदै।' },
    { year: '२०७५', yearEn: '2018 AD', title: 'विश्व सम्पदा', desc: '३०० वर्ष पूरा। संस्कृत शिक्षाको अन्तिम गढका रूपमा पहिचान।' },
    { year: '२०८२', yearEn: '2025 AD', title: 'वर्तमान', desc: 'आवासीय शिक्षा, समावेशी सिकाई, मिथिला संस्कृतिको संरक्षण।' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-20 bg-gradient-to-b from-sandalwood-900 via-maroon-900 to-sandalwood-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2382306/pexels-photo-2382306.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-sandalwood-900/50 via-transparent to-sandalwood-900" />
        <div className="absolute top-10 left-10 opacity-20"><MandalaSVG size={150} /></div>
        <div className="absolute bottom-10 right-10 opacity-15"><MandalaSVG size={180} /></div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400" />
            <LotusIconComponent className="w-8 h-8 text-gold-400" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400" />
          </div>
          <h1 className="font-devanagari text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-gradient">हाम्रो कथा</span>
          </h1>
          <p className="font-devanagari text-lg text-cream-200 max-w-2xl mx-auto">
            ३०८ वर्षको इतिहास — वि.सं. १७७५ देखि निरन्तर संस्कृत शिक्षाको दीप प्रज्वलित
          </p>
          <p className="font-english text-sm text-cream-400 italic mt-2">Our Story</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-gradient-to-b from-cream-50 to-sandalwood-50">
        <div className="max-w-6xl mx-auto px-4">
          <Section>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="section-card p-4 gradient-border">
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
                    <img src="https://images.pexels.com/photos/789555/pexels-photo-789555.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Gurukul Heritage" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-sandalwood-900/70 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="font-devanagari text-2xl font-bold text-cream-50">ऐतिहासिक विरासत</p>
                      <p className="font-devanagari text-cream-200 text-sm">३०८ वर्षको गौरव</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-saffron-400 to-gold-500 rounded-2xl p-6 shadow-xl">
                  <div className="font-devanagari text-4xl font-bold text-white">३०८</div>
                  <div className="font-devanagari text-white/80 text-sm">वर्ष</div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="font-devanagari text-3xl font-bold text-sandalwood-900">
                  <span className="text-gradient">राजकीय संस्कृत गुरुकुल, मटिहानी</span>
                </h2>
                <p className="font-devanagari text-lg text-sandalwood-700 leading-relaxed">
                  मटिहानी नगरपालिका–७, मधेश प्रदेश अन्तर्गत अवस्थित यो गुरुकुल नेपालको पहिलो तथा ऐतिहासिक गुरुकुल हो। वि.सं. १७७५ सालमा स्थापना भएको यस गुरुकुलले महोत्तरी जिल्लाको एक मात्र आवासीय संस्कृत शिक्षालयका रूपमा आफ्नो परिचय बनाएको छ।
                </p>
                <p className="font-devanagari text-lg text-sandalwood-600 leading-relaxed">
                  यस गुरुकुलले ३०८ वर्षदेखि संस्कृत शिक्षा, वैदिक अध्ययन, र सनातन संस्कारको संरक्षण गर्दै आएको छ। कक्षा ८ देखि १२ सम्मको आवासीय शिक्षा प्रदान गर्ने यस गुरुकुलमा मधेश, पहाड र उपत्यकाका विद्यार्थीहरू अध्ययनरत छन्।
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  {[
                    { num: '१७७५', label: 'स्थापना (वि.सं.)' },
                    { num: '३०८', label: 'वर्ष इतिहास' },
                    { num: '८-१२', label: 'कक्षाहरू' },
                    { num: 'उच्च', label: 'परम्परागत शिक्षा' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-saffron-50 rounded-xl border border-saffron-100">
                      <div className="font-devanagari text-2xl font-bold text-gradient">{item.num}</div>
                      <div className="font-devanagari text-sm text-sandalwood-600">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-sandalwood-900 text-cream-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/4"><MandalaSVG size={300} /></div>
          <div className="absolute top-1/3 right-1/4"><MandalaSVG size={200} /></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 relative">
          <Section>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400" />
                <Clock className="w-6 h-6 text-gold-400" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400" />
              </div>
              <h2 className="font-devanagari text-4xl font-bold text-cream-50"><span className="text-gold-400">इतिहास</span> यात्रा</h2>
              <p className="font-english text-cream-300 italic mt-2">Historical Timeline</p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-gold-400 via-saffron-400 to-maroon-400" />

              {timeline.map((item, i) => (
                <div key={i} className={`relative mb-12 ${i % 2 === 0 ? 'pr-1/2 mr-auto' : 'pl-1/2 ml-auto'} max-w-[calc(50%-2rem)]`}>
                  <div className={`section-card p-6 bg-white/5 backdrop-blur-sm border-white/10 ${i % 2 === 0 ? 'text-right mr-8' : 'text-left ml-8'}`}>
                    <div className={`flex items-center gap-2 mb-2 ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      <span className="font-devanagari text-2xl font-bold text-gold-400">{item.year}</span>
                      <span className="font-english text-sm text-cream-400">({item.yearEn})</span>
                    </div>
                    <h3 className="font-devanagari text-xl font-bold text-cream-50 mb-2">{item.title}</h3>
                    <p className="font-devanagari text-sm text-cream-300">{item.desc}</p>
                  </div>
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-gold-400 to-saffron-500 rounded-full border-4 border-sandalwood-900 shadow-lg" />
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-b from-sandalwood-50 to-cream-50">
        <div className="max-w-7xl mx-auto px-4">
          <Section>
            <div className="text-center mb-16">
              <h2 className="font-devanagari text-4xl font-bold text-sandalwood-900 mb-2">हाम्रा <span className="text-gradient">मूल्यहरू</span></h2>
              <p className="font-devanagari text-sandalwood-600">Our Core Values</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Scroll, title: 'परम्परा', desc: 'गुरु-शिष्य परम्पराको उत्कृष्ट मिश्रण' },
                { icon: Heart, title: 'समावेशिता', desc: 'सबै जात, वर्गको स्वागत' },
                { icon: Flame, title: 'सनातन धर्म', desc: 'वैदिक सिद्धान्त र मूल्यहरू' },
                { icon: Sparkles, title: 'संस्कार', desc: 'नैतिक तथा आध्यात्मिक शिक्षा' },
              ].map((item, i) => (
                <div key={i} className="section-card p-6 text-center group hover:shadow-2xl transition-all duration-500">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron-400 to-gold-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-devanagari text-xl font-bold text-sandalwood-900 mb-2">{item.title}</h3>
                  <p className="font-devanagari text-sm text-sandalwood-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-b from-cream-50 to-sandalwood-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Section>
            <h3 className="font-devanagari text-2xl font-bold text-sandalwood-900 mb-4">हाम्रो गुरुकुलमा समावेश हुनुहोस्</h3>
            <p className="font-devanagari text-sandalwood-600 mb-6">३०८ वर्षको परम्पराको हिस्सा बन्नुहोस्</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/admission" className="btn-primary">
                <span className="font-devanagari">भर्ना जानकारी</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/#contact" className="btn-secondary">
                <Phone className="w-5 h-5" />
                <span className="font-devanagari">सम्पर्क गर्नुहोस्</span>
              </Link>
            </div>
          </Section>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
