'use client'

import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-[#1A1F3C] to-[#0E1229]">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}