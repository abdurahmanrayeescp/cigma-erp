import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authApi, setAccessToken } from '@/lib/api'

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  referenceId?: string      // Linked Student / Teacher / Parent document _id
  referenceData?: any       // Full linked profile (children array for parents, etc.)
}

interface AuthContextValue {
  user: AuthUser | null
  accessToken: string | null
  isLoading: boolean
  login: (loginId: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
  isStaff: boolean
}

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN']
const STAFF_ROLES = ['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'OFFICE_STAFF', 'TEACHER']

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]           = useState<AuthUser | null>(null)
  const [accessToken, setToken]   = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const storeToken = useCallback((t: string | null) => {
    setToken(t)
    setAccessToken(t)
  }, [])

  // Fetches /me and merges referenceId / referenceData into an existing base user
  const fetchAndMergeProfile = useCallback(async (base: Partial<AuthUser>): Promise<AuthUser> => {
    try {
      const me = await authApi.me()
      const d = me.data as any
      return {
        id:            d.id            ?? base.id ?? '',
        name:          d.name          ?? base.name ?? '',
        email:         d.email         ?? base.email ?? '',
        role:          d.role          ?? base.role ?? '',
        avatar:        d.avatar        ?? base.avatar,
        referenceId:   d.referenceId   ?? undefined,
        referenceData: d.referenceData ?? undefined,
      }
    } catch {
      return base as AuthUser
    }
  }, [])

  // Restore session from refresh-token cookie on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const data = await authApi.refresh()
        storeToken(data.accessToken)
        // Decode JWT for a quick base object, then enrich with /me
        let base: Partial<AuthUser> = {}
        try {
          const payload = JSON.parse(atob(data.accessToken.split('.')[1]))
          base = { id: payload.userId, role: payload.role, name: '', email: '' }
        } catch { /* ignore */ }
        const enriched = await fetchAndMergeProfile(base)
        setUser(enriched)
      } catch {
        // No valid session
      } finally {
        setIsLoading(false)
      }
    }
    restoreSession()
  }, [storeToken, fetchAndMergeProfile])

  const login = useCallback(async (loginId: string, password: string) => {
    try {
      const data = await authApi.login(loginId, password)
      storeToken(data.accessToken)
      const base = data.user as unknown as Partial<AuthUser>
      const enriched = await fetchAndMergeProfile(base)
      setUser(enriched)
      return { success: true, role: enriched.role }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      return { success: false, message }
    }
  }, [storeToken, fetchAndMergeProfile])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch { /* ignore */ }
    setUser(null)
    storeToken(null)
  }, [storeToken])

  const value: AuthContextValue = {
    user,
    accessToken,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user ? ADMIN_ROLES.includes(user.role) : false,
    isStaff: user ? STAFF_ROLES.includes(user.role) : false,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
