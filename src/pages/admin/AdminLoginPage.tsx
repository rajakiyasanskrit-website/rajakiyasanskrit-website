import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../lib/admin-auth';
import {
  Eye,
  EyeOff,
  Lotus,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { signIn, resetPassword } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error, success } = await signIn(email, password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('गलत ईमेल वा पासवर्ड। कृपया पुनः प्रयास गर्नुहोस्।');
        } else if (error.message.includes('Email not confirmed')) {
          setError('ईमेल पुष्टि भएको छैन। कृपया ईमेल जाँच गर्नुहोस्।');
        } else {
          setError(error.message);
        }
      } else if (success) {
        navigate('/main_box/dashboard');
      }
    } catch {
      setError('सर्भर त्रुटि। कृपया पछि पुनः प्रयास गर्नुहोस्।');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { success } = await resetPassword(email);
      if (success) {
        setResetSuccess(true);
      }
    } catch {
      setError('पासवर्ड रिसेट गर्न सकिएन। कृपया पुनः प्रयास गर्नुहोस्।');
    } finally {
      setLoading(false);
    }
  };

  const LotusIcon = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 2C12 2 8 6 8 10C8 12 10 14 12 14C14 14 16 12 16 10C16 6 12 2 12 2Z" />
      <path d="M12 14C12 14 6 12 4 14C2 16 3 20 6 20C8 20 10 18 12 14Z" />
      <path d="M12 14C12 14 18 12 20 14C22 16 21 20 18 20C16 20 14 18 12 14Z" />
      <path d="M12 14V22" />
    </svg>
  );

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sandalwood-900 via-maroon-900 to-sandalwood-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-saffron-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-devanagari text-2xl font-bold text-sandalwood-900 mb-2">
              ईमेल पठाइयो!
            </h2>
            <p className="font-devanagari text-sandalwood-600 mb-6">
              पासवर्ड रिसेट लिङ्क तपाईंको ईमेलमा पठाइएको छ। कृपया ईमेल जाँच गर्नुहोस्।
            </p>
            <button
              onClick={() => {
                setResetMode(false);
                setResetSuccess(false);
              }}
              className="font-devanagari text-saffron-600 hover:text-saffron-700 font-medium"
            >
              लगइनमा फर्कनुहोस्
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sandalwood-900 via-maroon-900 to-sandalwood-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-gold-400 rounded-full" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-saffron-400 rounded-full" />
        <div className="absolute top-1/2 left-10 w-24 h-24 border border-maroon-400 rounded-full" />
        <div className="absolute top-10 right-1/4 w-16 h-16 border border-gold-400 rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-saffron-500 to-maroon-600 rounded-2xl shadow-2xl mb-4">
            <LotusIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-devanagari text-3xl font-bold text-white mb-2">
            राजकीय संस्कृत गुरुकुल
          </h1>
          <p className="font-english text-cream-300 text-sm">
            Admin Dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <h2 className="font-devanagari text-2xl font-bold text-sandalwood-900 text-center mb-2">
            {resetMode ? 'पासवर्ड रिसेट' : 'स्वागतम्'}
          </h2>
          <p className="font-devanagari text-sandalwood-500 text-center mb-6">
            {resetMode ? 'आफ्नो ईमेल प्रविष्ट गर्नुहोस्' : 'ड्यासबोर्डमा प्रवेश गर्नुहोस्'}
          </p>

          {error && (
            <div className="mb-4 p-4 bg-temple-50 border border-temple-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-temple-500 flex-shrink-0 mt-0.5" />
              <p className="font-devanagari text-sm text-temple-600">{error}</p>
            </div>
          )}

          <form onSubmit={resetMode ? handleResetPassword : handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block font-devanagari text-sm font-medium text-sandalwood-700 mb-2">
                ईमेल
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sandalwood-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gurukul.edu.np"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-sandalwood-200 rounded-xl focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 font-english text-sandalwood-900 placeholder:text-sandalwood-300"
                />
              </div>
            </div>

            {/* Password (only for login) */}
            {!resetMode && (
              <div>
                <label className="block font-devanagari text-sm font-medium text-sandalwood-700 mb-2">
                  पासवर्ड
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sandalwood-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3 border border-sandalwood-200 rounded-xl focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 font-english text-sandalwood-900 placeholder:text-sandalwood-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sandalwood-400 hover:text-sandalwood-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-saffron-500 to-maroon-500 text-white font-devanagari font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-saffron-600 hover:to-maroon-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>प्रतीक्षा गर्नुहोस्...</span>
                </>
              ) : (
                <span>{resetMode ? 'रिसेट लिङ्क पठाउनुहोस्' : 'लगइन गर्नुहोस्'}</span>
              )}
            </button>
          </form>

          {/* Toggle Reset Mode */}
          <div className="mt-6 text-center">
            {resetMode ? (
              <button
                onClick={() => setResetMode(false)}
                className="font-devanagari text-sm text-sandalwood-600 hover:text-saffron-600 flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                लगइनमा फर्कनुहोस्
              </button>
            ) : (
              <button
                onClick={() => setResetMode(true)}
                className="font-devanagari text-sm text-sandalwood-600 hover:text-saffron-600"
              >
                पासवर्ड भुल्नुभयो?
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="font-devanagari text-cream-300/60 text-xs text-center mt-6">
          © २०८२ राजकीय संस्कृत गुरुकुल, मटिहानी
        </p>
      </div>
    </div>
  );
}
