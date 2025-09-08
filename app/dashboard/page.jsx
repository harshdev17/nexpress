"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    
    if (!userData || !accessToken) {
      router.push('/customer/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchAnalytics(accessToken);
    fetchSessions(accessToken);
  }, [router]);

  const fetchAnalytics = async (token) => {
    try {
      const response = await fetch(`/api/analytics/login-insights?sessionToken=${token}&period=30`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.insights);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchSessions = async (token) => {
    try {
      const response = await fetch(`/api/auth/user-sessions?sessionToken=${token}`);
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: accessToken })
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Redirect to login
    router.push('/customer/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Total Logins</h3>
              <p className="text-3xl font-bold text-indigo-600">{analytics.overview?.total_logins || 0}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Unique Days</h3>
              <p className="text-3xl font-bold text-green-600">{analytics.overview?.unique_days || 0}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Avg Login Time</h3>
              <p className="text-3xl font-bold text-blue-600">{Math.round(analytics.overview?.avg_login_time || 0)}ms</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">High Risk Logins</h3>
              <p className="text-3xl font-bold text-red-600">{analytics.overview?.high_risk_logins || 0}</p>
            </div>
          </div>
        )}

        {/* Device Analytics */}
        {analytics?.devices && analytics.devices.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Device Usage</h3>
            <div className="space-y-4">
              {analytics.devices.map((device, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{device.device_type} - {device.browser_name}</p>
                    <p className="text-sm text-gray-600">{device.os_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{device.login_count} logins</p>
                    <p className="text-sm text-gray-600">{Math.round(device.avg_login_time)}ms avg</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Sessions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h3>
          {sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{session.device_type} - {session.browser_name}</p>
                    <p className="text-sm text-gray-600">IP: {session.ip_address}</p>
                    <p className="text-sm text-gray-600">Login: {new Date(session.login_time).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      session.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {session.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">Risk: {session.risk_score}/100</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No active sessions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
