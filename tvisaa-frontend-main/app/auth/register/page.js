'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { authAPI, extractErrorMessage } from '@/lib/api';
import { checkAndRecord } from '@/lib/rateLimit';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '', email: '', phone: '', password: '', password_confirm: '',
    });
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

        if (form.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        if (form.password !== form.password_confirm) {
            toast.error('Passwords do not match');
            return;
        }

        // Client-side rate limit check (mirrors backend 5/min limit)
        const { limited, waitSeconds: wait } = checkAndRecord('register');
        if (limited) {
            setRateLimited(true);
            setWaitSeconds(wait);
            toast.error(`Too many registration attempts. Please wait ${wait} seconds.`, {
                icon: '🚦',
                duration: 5000,
            });
            return;
        }

        setLoading(true);
        try {
            await authAPI.register(form);
            toast.success('Verification code sent to your email!');

            // Redirect to OTP verification page
            router.push(`/auth/verify-email?email=${encodeURIComponent(form.email)}`);
        } catch (err) {
            if (err.response?.status === 429) {
                // Backend 429 — already handled by the API client toast
                setRateLimited(true);
                setWaitSeconds(60);
            } else {
                const details = err.response?.data?.details;
                if (details?.email) toast.error('Email already registered');
                else toast.error(extractErrorMessage(err, 'Registration failed'));
            }
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = loading || rateLimited;

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <Image src="/images/logo.png" alt="Lumière Jewels" width={160} height={40} className="h-10 w-auto mx-auto mb-6" />
                    <h1 className="font-cormorant text-3xl text-noir">Create Account</h1>
                    <p className="text-sm text-mid font-light mt-2">Join the Lumière Jewels family</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-mid uppercase tracking-wider mb-2">Full Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 border border-blush bg-white text-noir text-sm font-jost outline-none focus:border-deep-rose transition-colors"
                            required
                            disabled={isDisabled}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-mid uppercase tracking-wider mb-2">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 border border-blush bg-white text-noir text-sm font-jost outline-none focus:border-deep-rose transition-colors"
                            required
                            disabled={isDisabled}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-mid uppercase tracking-wider mb-2">Phone</label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-blush bg-white text-noir text-sm font-jost outline-none focus:border-deep-rose transition-colors"
                            placeholder="+91"
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
                            minLength={8}
                            required
                            disabled={isDisabled}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-mid uppercase tracking-wider mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={form.password_confirm}
                            onChange={(e) => setForm({ ...form, password_confirm: e.target.value })}
                            className="w-full px-4 py-3 border border-blush bg-white text-noir text-sm font-jost outline-none focus:border-deep-rose transition-colors"
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
                            ? 'Creating Account...'
                            : rateLimited && waitSeconds > 0
                            ? `Try again in ${waitSeconds}s`
                            : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-mid mt-8">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-deep-rose hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
