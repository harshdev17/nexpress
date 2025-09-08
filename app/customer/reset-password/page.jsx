"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const t = params.get('token');
    if (!t) {
      setError('Missing reset token. Paste your token below.');
    } else {
      setToken(t);
    }
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!token) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Password updated successfully. Redirecting to login...');
        setTimeout(() => router.replace('/customer/login'), 2000);
      } else {
        setError(data.error || 'Unable to reset password');
      }
    } catch {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full bg-gray-50 min-h-screen py-12">
      <div className="max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Set a new password for your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">{message}</div>}
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">{error}</div>}

            {!params.get('token') && (
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">Reset Token</label>
                <input
                  id="token"
                  type="text"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors"
                  placeholder="Paste the token from your email"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors"
                placeholder="Confirm new password"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full py-3 rounded-md text-white bg-[#368899] hover:bg-[#2a6b7a] disabled:opacity-60"
            >
              {isLoading ? 'Updating...' : 'Update password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/customer/login" className="text-[#368899] hover:text-[#2a6b7a]">Back to login</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="w-full bg-gray-50 min-h-screen py-12 flex items-center justify-center"><span className="text-gray-600">Loading...</span></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}


