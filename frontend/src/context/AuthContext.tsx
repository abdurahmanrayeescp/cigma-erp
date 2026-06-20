import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authApi, setAccessToken } from '@/lib/api'

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  referenceId?: string
  avatar?: string
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

const ADMIN_ROLES  = ['SUPER_ADMIN', 'ADMIN']
const STAFF_ROLES  = ['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'OFFICE_STAFF', 'TEACHER']

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]               = useState<AuthUser | null>(null)
  const [accessToken, setToken]       = useState<string | null>(null)
  const [isLoading, setIsLoading]     = useState(true)   // starts true — checks session on mount

  // keep module-level token in sync
  const storeToken = useCallback((t: string | null) => {
    setToken(t)
    setAccessToken(t)
  }, [])

  // ── Try to restore session via refresh token cookie on page load ──────
  useEffect(() => {
    async function restoreSession() {
      try {
        const data = await authApi.refresh()
        storeToken(data.accessToken)
        try {
          const me = await authApi.me()
          setUser(me.data as AuthUser)
        } catch {
          // Decode JWT payload as fallback
          const payload = JSON.parse(atob(data.accessToken.split('.')[1]))
          setUser({ id: payload.userId, name: '', email: '', role: payload.role })
        }
      } catch {
        // No valid session — user stays null
      } finally {
        setIsLoading(false)
      }
    }
    restoreSession()
  }, [storeToken])

  // ── Login ─────────────────────────────────────────────────────────────
  const login = useCallback(async (loginId: string, password: string) => {
    try {
      const data = await authApi.login(loginId, password)
      storeToken(data.accessToken)
      setUser(data.user as unknown as AuthUser)
      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      return { success: false, message }
    }
  }, [storeToken])

  // ── Logout ────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch { /* ignore network errors */ }
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
    isAdmin:  user ? ADMIN_ROLES.includes(user.role)  : false,
    isStaff:  user ? STAFF_ROLES.includes(user.role)  : false,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
