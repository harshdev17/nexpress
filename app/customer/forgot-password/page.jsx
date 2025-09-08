"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('If the email exists, a reset link has been sent.');
      } else {
        setError(data.error || 'Unable to process request');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full bg-gray-50 min-h-screen py-12">
      <div className="max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-600">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">{message}</div>}
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">{error}</div>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-md text-white bg-[#368899] hover:bg-[#2a6b7a] disabled:opacity-60"
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
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


