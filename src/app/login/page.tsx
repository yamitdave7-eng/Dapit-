'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Compass, Eye, EyeOff, LoaderCircle, MapPin, Search, Store, UsersRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { AccountRole } from '@/types/auth';

type Mode = 'signin' | 'signup' | 'recovery';

const options: { role: Exclude<AccountRole, 'admin'>; label: string }[] = [
  { role: 'student', label: 'I’m looking for work or talent' },
  { role: 'resident', label: 'I’m here to discover and connect' },
  { role: 'business_owner', label: 'I’m here to grow a business' },
];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Exclude<AccountRole, 'admin'>>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: name.trim(), role }, emailRedirectTo: `${origin}/auth/callback` },
        });
        if (authError) throw authError;
        if (data.session) router.replace('/');
        else setMessage('Check your inbox to confirm your email. You can sign in after confirming.');
      } else if (mode === 'recovery') {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${origin}/auth/callback?next=/reset-password` });
        if (authError) throw authError;
        setMessage('If an account uses that address, a password reset link is on its way.');
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
        if (data.session) {
          await fetch('/api/auth/login-history', { method: 'POST', keepalive: true }).catch(() => undefined);
        }
        router.replace('/');
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to complete that request. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const heading = mode === 'signup' ? 'Create your account' : mode === 'recovery' ? 'Reset your password' : 'Welcome back';

  return (
    <main className="min-h-screen bg-[#f5f7f4] dark:bg-[#111a16] text-[#17251d] dark:text-[#edf4ef]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="auth-brand group flex items-center gap-2.5" aria-label="DAPIT home">
          <span className="auth-brand-mark grid h-10 w-10 place-items-center rounded-xl bg-[#17613f] text-lg font-black text-white shadow-sm transition-transform duration-200 group-hover:rotate-[-5deg] group-hover:scale-105">D</span>
          <span className="text-xl font-extrabold tracking-tight text-[#17613f] dark:text-emerald-300">dapit</span>
        </Link>
        <Link href="/" className="auth-browse-link text-sm font-semibold text-slate-600 hover:text-emerald-800 dark:text-slate-300">Browse marketplace <ArrowRight className="ml-1 inline h-4 w-4 transition-transform duration-200" /></Link>
      </header>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-12 pt-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-20 lg:pb-20 lg:pt-12">
        <section className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow-sm dark:border-white/10 dark:bg-[#1b2821] dark:text-emerald-200"><Compass className="h-4 w-4" /> One marketplace, wherever you are</div>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.04] tracking-[-.05em] sm:text-5xl lg:text-6xl">Find a place.<br />Find your people.<br /><span className="text-[#37815c] dark:text-emerald-300">Find what’s next.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">Explore venues and local services, discover events, find work, or connect with independent professionals near you or online.</p>
          <div className="mt-8 grid max-w-xl grid-cols-2 gap-3">
            {[
              { icon: Store, label: 'Places & services', detail: 'Local or further afield' },
              { icon: BriefcaseBusiness, label: 'Jobs & projects', detail: 'In person or remote' },
              { icon: Search, label: 'Events & spaces', detail: 'Find your next outing' },
              { icon: UsersRound, label: 'People & skills', detail: 'Connect and collaborate' },
            ].map(({ icon: Icon, label, detail }, index) => <div key={label} style={{ animationDelay: `${index * 70}ms` }} className="auth-feature-enter auth-feature-card rounded-2xl border border-[#e4e9e4] bg-white/85 p-4 dark:border-[#304238] dark:bg-[#1b2821]"><Icon className="h-5 w-5 text-emerald-700 dark:text-emerald-300" /><p className="mt-3 text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p></div>)}
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"><MapPin className="h-4 w-4 text-emerald-700 dark:text-emerald-300" /> Browse nearby, or explore from anywhere.</p>
        </section>

        <section className="auth-panel mx-auto w-full max-w-md rounded-[28px] border border-[#e4e9e4] bg-white p-6 shadow-[0_28px_80px_-45px_rgba(22,60,40,.45)] dark:border-[#304238] dark:bg-[#1b2821] sm:p-8">
          <div className="mb-6">
            {mode !== 'signin' && <button onClick={() => { setMode('signin'); setError(''); setMessage(''); }} className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-800 dark:text-slate-400 dark:hover:text-emerald-300"><ArrowLeft className="h-3.5 w-3.5" /> Back to sign in</button>}
            <p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-700 dark:text-emerald-300">DAPIT account</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{heading}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{mode === 'signup' ? 'Join the marketplace and make your profile yours.' : mode === 'recovery' ? 'We’ll email you a secure link to choose a new password.' : 'Sign in to post, apply, RSVP, and manage your account.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && <>
              <label className="block text-sm font-medium">Your name<input value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} autoComplete="name" className="auth-input mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none ring-emerald-700/20 focus:ring-4 dark:border-slate-700 dark:bg-[#111a16]" /></label>
              <label className="block text-sm font-medium">How will you use DAPIT?<select value={role} onChange={(event) => setRole(event.target.value as typeof role)} className="auth-input mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none ring-emerald-700/20 focus:ring-4 dark:border-slate-700 dark:bg-[#111a16]">{options.map((option) => <option key={option.role} value={option.role}>{option.label}</option>)}</select></label>
            </>}
            <label className="block text-sm font-medium">Email address<input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" autoComplete="email" className="auth-input mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none ring-emerald-700/20 focus:ring-4 dark:border-slate-700 dark:bg-[#111a16]" /></label>
            {mode !== 'recovery' && <label className="block text-sm font-medium">Password<div className="relative mt-1.5"><input value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} className="auth-input w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 pr-11 text-sm outline-none ring-emerald-700/20 focus:ring-4 dark:border-slate-700 dark:bg-[#111a16]" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>{mode === 'signup' && <span className="mt-1 block text-[11px] text-slate-500">Use at least 8 characters.</span>}</label>}
            {error && <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
            {message && <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">{message}</p>}
            <button disabled={busy} className="auth-submit flex w-full items-center justify-center gap-2 rounded-xl bg-[#17613f] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#104d32] disabled:cursor-wait disabled:opacity-60">
              {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-xs">
            {mode === 'signin' ? <><button onClick={() => { setMode('recovery'); setError(''); setMessage(''); }} className="font-semibold text-emerald-800 hover:underline dark:text-emerald-300">Forgot password?</button><button onClick={() => { setMode('signup'); setError(''); setMessage(''); }} className="font-semibold text-emerald-800 hover:underline dark:text-emerald-300">Create account</button></> : mode === 'signup' ? <span className="text-slate-500">Already have an account?</span> : <span className="text-slate-500">No account? <button onClick={() => setMode('signup')} className="font-semibold text-emerald-800 hover:underline dark:text-emerald-300">Create one</button></span>}
            {mode === 'signup' && <button onClick={() => setMode('signin')} className="font-semibold text-emerald-800 hover:underline dark:text-emerald-300">Sign in</button>}
          </div>
          <p className="mt-6 border-t border-slate-100 pt-4 text-center text-[11px] leading-5 text-slate-400 dark:border-slate-700">By continuing, you agree to use DAPIT respectfully and provide accurate account information.</p>
        </section>
      </div>
    </main>
  );
}


