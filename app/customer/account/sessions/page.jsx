"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/customer/login");
      return;
    }
    fetchSessions(token);
  }, [router]);

  const fetchSessions = async (token) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/auth/user-sessions?sessionToken=${token}`);
      if (res.status === 401) {
        // Session invalid – redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        router.push('/customer/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions || []);
        setCurrent(data.currentSession || null);
        setError("");
      } else {
        setError(data.error || "Failed to load sessions");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutSession = async (sessionId) => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, reason: 'user_logout' })
      });
      const data = await res.json();
      if (data.success) {
        // If user logged out current session, clear and redirect to login
        if (current && sessionId === current.id) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          router.push('/customer/login');
          return;
        }
        const token = localStorage.getItem("accessToken");
        fetchSessions(token);
      } else {
        alert(data.error || 'Failed to logout session');
      }
    } catch (e) {
      alert('Network error. Please try again.');
    }
  };

  const handleLogoutAll = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: token, reason: 'logout_all' })
      });
      const data = await res.json();
      if (data.success) {
        // Clear local
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        router.push('/customer/login');
      } else {
        alert(data.error || 'Failed to logout');
      }
    } catch (e) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <main className="w-full bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Active Sessions</h1>
            <p className="text-gray-600 text-sm">Manage your logged-in devices and sessions</p>
          </div>
          <button
            onClick={handleLogoutAll}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout from all devices
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
        )}

        {loading ? (
          <div className="text-center text-gray-600">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-gray-600">No active sessions found.</div>
        ) : (
          <div className="space-y-4">
            {sessions.map((s) => (
              <div key={s.id} className={`border rounded-lg p-4 bg-white ${current?.id === s.id ? 'border-[#368899]' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{s.device_type || 'Unknown device'}</span>
                      {current?.id === s.id && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Current</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="mr-3">Browser: {s.browser_name || 'N/A'}</span>
                      <span className="mr-3">IP: {s.ip_address || 'N/A'}</span>
                      <span>Risk: {s.risk_score ?? 0}/100</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Login: {new Date(s.login_time).toLocaleString()} • Last activity: {new Date(s.last_activity).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${s.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => handleLogoutSession(s.id)}
                      className="px-3 py-1.5 text-sm bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
