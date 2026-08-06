'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authAPI, extractErrorMessage } from '@/lib/api';
import { checkAndRecord, clearAttempts } from '@/lib/rateLimit';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [rateLimited, setRateLimited] = useState(false);
    const [waitSeconds, setWaitSeconds] = useState(0);

    // Countdown timer when rate-limited
    useEffect(() => {
        if (waitSeconds <= 0) {
            setRateLimited(false);
            return;
        }
        const timer = setTimeout(() => setWaitSeconds((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [waitSeconds]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            toast.error('Please fill all fields');
            return;
        }

        // Client-side rate limit check (mirrors backend 5/min limit)
        const { limited, waitSeconds: wait } = checkAndRecord('login');
        if (limited) {
            setRateLimited(true);
            setWaitSeconds(wait);
            toast.error(`Too many login attempts. Please wait ${wait} seconds.`, {
                icon: '🚦',
                duration: 5000,
            });
            return;
        }

        setLoading(true);
        try {
            // First, try to login via the Django API directly to get proper error messages
            await authAPI.login(form);

            // If API login succeeds, use NextAuth to create the session
            const result = await signIn('credentials', {
                redirect: false,
                email: form.email,
                password: form.password,
            });

            if (result?.error) {
                toast.error('Login failed. Please try again.');
                setLoading(false);
            } else {
                clearAttempts('login');
                toast.success('Welcome back!');
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            const details = err.response?.data?.details;
            if (err.response?.status === 429) {
                // Backend 429 — already handled by the API client toast
                setRateLimited(true);
                setWaitSeconds(60);
            } else if (details?.email_not_verified) {
                // Redirect to OTP verification page
                toast.error('Please verify your email first');
                router.push(`/auth/verify-email?email=${encodeURIComponent(form.email)}`);
            } else {
                toast.error(extractErrorMessage(err, 'Invalid email or password'));
            }
            setLoading(false);
        }
    };

    const isDisabled = loading || rateLimited;

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <Image src="/images/logo.png" alt="Lumière Jewels" width={160} height={40} className="h-10 w-auto mx-auto mb-6" />
                    <h1 className="font-cormorant text-3xl text-noir">Welcome Back</h1>
                    <p className="text-sm text-mid font-light mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs text-mid uppercase tracking-wider mb-2">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 border border-blush bg-white text-noir text-sm font-jost outline-none focus:border-deep-rose transition-colors"
                            placeholder="you@example.com"
                            required
                            disabled={isDisabled}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-mid uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-4 py-3 border border-blush bg-white text-noir text-sm font-jost outline-none focus:border-deep-rose transition-colors"
                            placeholder="••••••••"
                            required
                            disabled={isDisabled}
                        />
                    </div>

                    {rateLimited && waitSeconds > 0 && (
                        <p className="text-xs text-center text-deep-rose/80 font-jost">
                            🚦 Too many attempts. Try again in{' '}
                            <span className="font-semibold">{waitSeconds}s</span>
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isDisabled}
                        className="w-full bg-deep-rose text-white py-3.5 text-sm font-jost font-medium tracking-wider uppercase hover:bg-deep-rose/90 transition-colors disabled:opacity-50"
                    >
                        {loading
                            ? 'Signing In...'
                            : rateLimited && waitSeconds > 0
                            ? `Try again in ${waitSeconds}s`
                            : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-sm text-mid mt-8">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" className="text-deep-rose hover:underline">Create one</Link>
                </p>
            </div>
        </div>
    );
}
