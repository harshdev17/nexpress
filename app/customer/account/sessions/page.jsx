"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AccountTabs from "@/components/common/AccountTabs";

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
    <main className="w-full bg-gray-50 min-h-screen py-10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#368899] to-[#2d7a8a] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H3m12 0l-4 4m4-4l-4-4m11 8V8a2 2 0 00-2-2h-3m-4 0H6a2 2 0 00-2 2v8a2 2 0 002 2h11a2 2 0 002-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Active Sessions</h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1">Manage your logged-in devices and sessions</p>
              </div>
            </div>
            <button
              onClick={handleLogoutAll}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg w-full sm:w-auto text-center"
            >
              Logout from all devices
            </button>
          </div>
        </div>

        {/* Account Tabs */}
        <div className="mb-8">
          <AccountTabs />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="text-gray-600">Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No active sessions found</h3>
              <p className="text-gray-600">You don't have any active sessions at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((s) => (
                <div key={s.id} className={`border-2 rounded-xl p-4 sm:p-6 bg-white shadow-sm hover:shadow-md transition-all duration-200 ${
                  current?.id === s.id ? 'border-[#368899] bg-blue-50' : 'border-gray-200'
                }`}>
                  <div className="flex flex-col space-y-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="text-base sm:text-lg font-semibold text-gray-900 capitalize truncate">{s.device_type || 'Unknown device'}</span>
                            {current?.id === s.id && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium border border-green-200 self-start sm:self-center">
                                Current Session
                              </span>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 mt-1 space-y-1 sm:space-y-0 sm:space-x-4">
                            <div className="sm:inline">Browser: {s.browser_name || 'N/A'}</div>
                            <div className="sm:inline">IP: {s.ip_address || 'N/A'}</div>
                            <div className="sm:inline">Risk: {s.risk_score ?? 0}/100</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">Login:</span>
                          <span className="break-all">{new Date(s.login_time).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="font-medium">Last activity:</span>
                          <span className="break-all">{new Date(s.last_activity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${
                        s.is_active 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleLogoutSession(s.id)}
                        className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
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
      </div>
    </main>
  );
}
