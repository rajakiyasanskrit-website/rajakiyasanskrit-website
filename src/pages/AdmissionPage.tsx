import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  BookOpen,
  Sparkles,
  ArrowRight,
  Phone,
  CheckCircle,
  MapPin,
  Calendar,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const MandalaSVG = ({ className = '', size = 100 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={`mandala-rotate ${className}`}>
    <defs>
      <pattern id="mandalaAdmission" patternUnits="userSpaceOnUse" width="100" height="100">
        <circle cx="50" cy="50" r="3" className="fill-saffron-400" opacity="0.3" />
      </pattern>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#mandalaAdmission)" />
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
  return (<div ref={ref} className="transition-all duration-1000 ease-out" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transitionDelay: `${delay}ms` }}>{children}</div>);
};

const AdmissionPage = () => {
  const steps = [
    { num: '१', title: 'सम्पर्क', desc: 'गुरुकुलमा भर्ना सम्बन्धी जानकारी लिन फोन गर्नुहोस् वा गुरुकुलमा आइजानुहोस्।', icon: Phone },
    { num: '२', title: 'आवेदन', desc: 'आवेदन फारम भर्नुहोस् र आवश्यक कागजातहरू पेश गर्नुहोस्।', icon: BookOpen },
    { num: '३', title: 'अन्तर्वार्ता', desc: 'विद्यार्थी तथा अभिभावकसँग अन्तर्वार्ता गरिनेछ।', icon: Users },
    { num: '४', title: 'स्वीकृति', desc: 'छनौट भएका विद्यार्थीहरूलाई सूचना गरिनेछ।', icon: CheckCircle },
  ];

  const seats = [
    { class: '८', seats: '३०', available: true },
    { class: '९', seats: '३०', available: true },
    { class: '१०', seats: 'सिमित', available: false },
    { class: '११', seats: 'सिमित', available: false },
    { class: '१२', seats: 'सिमित', available: false },
  ];

  const documents = [
    'जन्म प्रमाण पत्र',
    'अघिल्लो कक्षाको ग्रेड शीट',
    'स्कूल लिभिङ सर्टिफिकेट',
    'पासपोर्ट साइज फोटो (४ प्रति)',
    'चारित्रिक प्रमाण पत्र',
    'दलित/जनजाति प्रमाण पत्र (यदि लागू हुन्छ भने)',
  ];

  return (
    <>
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-20 bg-gradient-to-b from-sandalwood-900 via-maroon-900 to-sandalwood-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-sandalwood-900/50 via-transparent to-sandalwood-900" />
        <div className="absolute top-10 left-10 opacity-20"><MandalaSVG size={150} /></div>
        <div className="absolute bottom-10 right-10 opacity-15"><MandalaSVG size={180} /></div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400" />
            <GraduationCap className="w-8 h-8 text-gold-400" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400" />
          </div>
          <h1 className="font-devanagari text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-gradient">भर्ना खुला छ</span>
          </h1>
          <p className="font-devanagari text-lg text-cream-200 max-w-2xl mx-auto">
            कक्षा ८ र ९ मा सिमित सिट उपलब्ध — परम्परागत संस्कृत शिक्षा र आवासीय जीवनको अवसर
          </p>
          <p className="font-english text-sm text-cream-400 italic mt-2">Admissions Open</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Calendar className="w-4 h-4 text-saffron-400" />
              <span className="font-devanagari text-sm text-cream-50">आश्विन ३० गते सम्म</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <CheckCircle className="w-4 h-4 text-gold-400" />
              <span className="font-devanagari text-sm text-cream-50">निःशुल्क आवास तथा भोजन</span>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-gradient-to-b from-cream-50 to-sandalwood-50">
        <div className="max-w-6xl mx-auto px-4">
          <Section>
            <div className="text-center mb-12">
              <h2 className="font-devanagari text-3xl font-bold text-sandalwood-900 mb-2">
                भर्ना <span className="text-gradient">प्रक्रिया</span>
              </h2>
              <p className="font-english text-sandalwood-600 italic">Application Process</p>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-saffron-400 via-gold-400 to-maroon-400 -translate-y-1/2" />

              <div className="grid md:grid-cols-4 gap-6">
                {steps.map((step, i) => (
                  <div key={i} className="relative">
                    <div className="section-card p-6 text-center hover:shadow-2xl transition-all duration-500">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron-400 to-gold-500 flex items-center justify-center mx-auto mb-4 text-white font-devanagari text-2xl font-bold shadow-lg relative z-10">
                        {step.num}
                      </div>
                      <step.icon className="w-6 h-6 text-saffron-500 mx-auto mb-2" />
                      <h3 className="font-devanagari text-lg font-bold text-sandalwood-900 mb-2">{step.title}</h3>
                      <p className="font-devanagari text-sm text-sandalwood-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* Available Seats */}
      <section className="py-16 bg-sandalwood-900 text-cream-100">
        <div className="max-w-5xl mx-auto px-4">
          <Section>
            <div className="text-center mb-12">
              <h2 className="font-devanagari text-3xl font-bold text-cream-50 mb-2">
                उपलब्ध <span className="text-gold-400">सिटहरू</span>
              </h2>
              <p className="font-english text-cream-300 italic">Available Seats</p>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {seats.map((seat, i) => (
                <div key={i} className={`section-card p-4 text-center ${seat.available ? 'bg-gradient-to-br from-saffron-400/20 to-gold-400/20 border-saffron-400/30' : 'bg-white/5 border-white/10'} border backdrop-blur-sm`}>
                  <div className="font-devanagari text-2xl font-bold text-gold-400 mb-1">{seat.class}</div>
                  <div className="font-devanagari text-xs text-cream-300">कक्षा</div>
                  <div className={`mt-2 py-1 px-2 rounded text-xs ${seat.available ? 'bg-saffron-500 text-white' : 'bg-sandalwood-700 text-cream-300'}`}>
                    {seat.seats} {seat.available ? 'सिट' : ''}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gold-400/10 border border-gold-400/20 rounded-xl text-center">
              <p className="font-devanagari text-cream-200 text-sm">
                <AlertCircle className="w-4 h-4 inline mr-2 text-gold-400" />
                दलित, जनजाति तथा आर्थिक रूपमा विपन्न वर्गका विद्यार्थीहरूलाई प्राथमिकता दिइनेछ।
              </p>
            </div>
          </Section>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-16 bg-gradient-to-b from-sandalwood-50 to-cream-50">
        <div className="max-w-5xl mx-auto px-4">
          <Section>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-devanagari text-3xl font-bold text-sandalwood-900 mb-4">
                  आवश्यक <span className="text-gradient">कागजातहरू</span>
                </h2>
                <p className="font-devanagari text-sandalwood-600 mb-6">
                  भर्ना प्रक्रियामा सहभागी हुन निम्न कागजातहरू आवश्यक पर्नेछ:
                </p>

                <ul className="space-y-3">
                  {documents.map((doc, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 bg-saffron-50 rounded-lg border border-saffron-100">
                      <CheckCircle className="w-5 h-5 text-saffron-500 flex-shrink-0" />
                      <span className="font-devanagari text-sandalwood-800">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="section-card p-8 gradient-border">
                <div className="text-center">
                  <LotusIcon className="w-16 h-16 text-saffron-400 mx-auto mb-4" />
                  <h3 className="font-devanagari text-xl font-bold text-sandalwood-900 mb-2">
                    शिक्षा सहभागी हुनुहोस्
                  </h3>
                  <p className="font-devanagari text-sm text-sandalwood-600 mb-6">
                    ३०८ वर्षको परम्पराको हिस्सा बन्नुहोस्
                  </p>

                  <div className="p-4 bg-sandalwood-50 rounded-xl border border-sandalwood-200 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-saffron-500" />
                      <span className="font-devanagari text-sm text-sandalwood-600">सम्पर्क गर्नुहोस्</span>
                    </div>
                    <a href="tel:+9779844031624" className="font-devanagari text-2xl font-bold text-gradient">
                      ९८४४०३१६२४
                    </a>
                    <p className="font-devanagari text-xs text-sandalwood-500 mt-1">ईश्वरीप्रसाद पौडेल</p>
                  </div>

                  <div className="p-4 bg-gold-50 rounded-xl border border-gold-200">
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4 text-gold-600" />
                      <span className="font-devanagari text-sm text-sandalwood-700">मटिहानी नगरपालिका–७</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-saffron-500 via-gold-500 to-saffron-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="font-devanagari text-2xl font-bold text-white mb-2">अहिले आवेदन दिनुहोस्</h3>
          <p className="font-devanagari text-white/80 mb-6">भर्ना प्रक्रिया जानकारीका लागि गुरुकुलमा सम्पर्क गर्नुहोस्</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:+9779844031624" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-saffron-600 font-devanagari font-bold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <Phone className="w-5 h-5" />
              ९८४४०३१६२४
            </a>
            <Link to="/#contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 text-white font-devanagari font-bold rounded-lg backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all">
              थप जानकारी
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdmissionPage;
