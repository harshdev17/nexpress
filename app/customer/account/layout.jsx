import AuthGuard from '@/components/common/AuthGuard';

export default function AccountSectionLayout({ children }) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}


