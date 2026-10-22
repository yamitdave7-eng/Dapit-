'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Store,
  Calendar,
  Briefcase,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Coffee,
  GraduationCap,
  Home,
  Sun,
  Moon,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Register modal states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'student' | 'resident' | 'business_owner'>('student');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') ||
      localStorage.getItem('dapit_theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dapit_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dapit_theme', 'light');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userRole = email.includes('roastery') || email.includes('elena')
      ? 'business_owner'
      : email.includes('sarah')
      ? 'resident'
      : 'student';

    const userData = {
      name: email.split('@')[0] || 'DAPIT Member',
      email: email || 'user@dapit.community',
      role: userRole,
    };
    localStorage.setItem('dapit_user', JSON.stringify(userData));
    localStorage.setItem('dapit_role', userRole);
    router.push('/');
  };

  const handleQuickLogin = (role: 'business_owner' | 'student' | 'resident') => {
    const profiles = {
      business_owner: {
        name: 'Elena Rostova',
        email: 'elena@artisanroastery.com',
        role: 'business_owner',
      },
      student: {
        name: 'Marcus Tan',
        email: 'marcus.tan@student.edu',
        role: 'student',
      },
      resident: {
        name: 'Sarah Jenkins',
        email: 'sarah.j@localresident.org',
        role: 'resident',
      },
    };

    localStorage.setItem('dapit_user', JSON.stringify(profiles[role]));
    localStorage.setItem('dapit_role', role);
    router.push('/');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      name: regName || 'New Member',
      email: regEmail,
      role: regRole,
    };
    localStorage.setItem('dapit_user', JSON.stringify(userData));
    localStorage.setItem('dapit_role', regRole);
    setShowRegisterModal(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-emerald-50/40 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* Top minimal header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-emerald-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <span className="font-black text-xl">D</span>
          </div>
          <span className="text-2xl font-black tracking-tight text-emerald-800 dark:text-emerald-400">
            dapit
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl border border-emerald-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-700" />}
          </button>

          <Link
            href="/"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline px-3 py-1.5"
          >
            Browse as Guest →
          </Link>
        </div>
      </header>

      {/* Main Facebook-Style Split Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 w-full flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          {/* Left Column: Big DAPIT Branding & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-3 border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>The Community Discovery & Career Network</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-emerald-900 dark:text-white tracking-tight leading-none">
                dapit
              </h1>
              <p className="mt-4 text-xl sm:text-2xl font-medium text-slate-700 dark:text-slate-300 leading-snug max-w-xl mx-auto lg:mx-0">
                Connect with local neighborhood businesses, attend community workshops, and launch your career in one place.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold mb-2">
                  <Store className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">LocalLens Discovery</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Explore verified storefronts, cafés, repair hubs, and community workshops near you.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold mb-2">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Community Events</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  RSVP to latte art masterclasses, tech mixers, terrarium workshops, and bike clinics.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold mb-2">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">CareerLink Vacancies</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  1-click quick apply for student internships, barista gigs, and neighborhood jobs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold mb-2">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Student & Talent Hub</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Showcase skills, connect directly with local employers, and join study groups.
                </p>
              </div>
            </div>

            {/* Social Proof Bar */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-500 dark:text-slate-400 pt-2">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>100% Free Forever</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Local Businesses</span>
              </span>
            </div>
          </div>

          {/* Right Column: Facebook-Style Authentication Card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl shadow-emerald-950/5 dark:shadow-none border border-emerald-100 dark:border-slate-800 space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address or phone number"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-[0.99]"
                >
                  Log In
                </button>
              </form>

              <div className="text-center">
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Demo Mode: Click any of the Quick Demo Profiles below to sign in instantly!');
                  }}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-wider">or</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              {/* Create New Account Button (Green Accent) */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(true)}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm active:scale-[0.99]"
                >
                  Create new account
                </button>
              </div>

              {/* Quick Demo Logins Bar (1-click access) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
                  ⚡ 1-Click Demo Profiles
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('business_owner')}
                    className="w-full text-left p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100/70 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                        <Coffee className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Elena Rostova</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Café Owner (Artisan Roastery)</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded">
                      Employer ➔
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('student')}
                    className="w-full text-left p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/70 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Marcus Tan</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Student & Job Seeker</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                      Applicant ➔
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('resident')}
                    className="w-full text-left p-2.5 rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/60 dark:bg-teal-950/30 hover:bg-teal-100/70 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-teal-200 dark:bg-teal-900 text-teal-900 dark:text-teal-200">
                        <Home className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Sarah Jenkins</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Neighborhood Resident</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 rounded">
                      Resident ➔
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Business Registration Note */}
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
              <strong>Are you a local business owner?</strong> List your storefront on LocalLens and post your first job opening for free.
            </p>
          </div>
        </div>
      </main>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 dark:border-slate-800 p-6 sm:p-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Sign Up for DAPIT</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  It&apos;s quick, free, and opens your neighborhood to you.
                </p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegister} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  I am joining primarily as a:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('student')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                      regRole === 'student'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Student / Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('resident')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                      regRole === 'resident'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Local Resident
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('business_owner')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                      regRole === 'business_owner'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Business Owner
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20"
                >
                  Create DAPIT Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer minimal */}
      <footer className="w-full py-6 border-t border-emerald-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© 2026 DAPIT Platform. All rights reserved.</div>
          <div className="flex space-x-4">
            <Link href="/" className="hover:underline">Explore Platform</Link>
            <span>•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">LocalLens + CareerLink</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
