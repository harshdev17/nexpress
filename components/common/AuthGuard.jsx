"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) {
          router.push('/customer/login');
          return;
        }
        const res = await fetch('/api/protected/profile', {
          credentials: 'include',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setAuthorized(true);
        } else {
          router.push('/customer/login');
        }
      } catch (e) {
        router.push('/customer/login');
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">Checking authentication…</div>
    );
  }

  if (!authorized) return null;
  return children;
}


