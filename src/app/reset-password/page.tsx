'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (password.length < 8) return setError('Use at least 8 characters for your password.');
    if (password !== confirmation) return setError('The passwords do not match.');
    setBusy(true);
    try {
      const { error: updateError } = await createClient().auth.updateUser({ password });
      if (updateError) throw updateError;
      setMessage('Password updated. You can sign in with your new password.');
      window.setTimeout(() => router.replace('/login'), 1200);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not update your password. Request a new reset link and try again.');
    } finally {
      setBusy(false);
    }
  }

  return <main className="grid min-h-screen place-items-center bg-[#f5f7f4] px-5 dark:bg-[#111a16]"><section className="w-full max-w-md rounded-3xl border border-[#e4e9e4] bg-white p-7 shadow-xl dark:border-[#304238] dark:bg-[#1b2821]"><Link href="/" className="text-sm font-bold text-emerald-800 dark:text-emerald-300">DAPIT</Link><h1 className="mt-5 text-2xl font-semibold">Choose a new password</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Make it at least 8 characters long.</p><form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-medium">New password<input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm dark:border-slate-700 dark:bg-[#111a16]" /></label><label className="block text-sm font-medium">Confirm password<input type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm dark:border-slate-700 dark:bg-[#111a16]" /></label>{error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p>}{message && <p role="status" className="text-sm text-emerald-800 dark:text-emerald-200">{message}</p>}<button disabled={busy} className="w-full rounded-xl bg-[#17613f] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{busy ? 'Saving…' : 'Update password'}</button></form></section></main>;
}
