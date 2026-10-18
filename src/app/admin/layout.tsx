'use client'

import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The dashboard handles its own background and responsive padding
  return <ProtectedRoute requireAdmin={true}>{children}</ProtectedRoute>
}
