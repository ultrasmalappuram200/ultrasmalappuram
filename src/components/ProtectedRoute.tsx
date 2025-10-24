'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/admin-login')
      } else if (requireAdmin && !isAdmin) {
        router.push('/')
      }
    }
  }, [user, loading, isAdmin, requireAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F3C] to-[#0E1229]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-orange-400 border-t-transparent rounded-full mb-4 mx-auto"></div>
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null
  }

  return <>{children}</>
}
