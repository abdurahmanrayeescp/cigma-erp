import { useState } from 'react'
import { Settings, Shield, User, KeyRound, Check } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authApi } from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const [tfa, setTfa] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long')
      return
    }

    setLoading(true)
    try {
      const res = await authApi.changePassword(currentPassword, newPassword)
      if (res.success) {
        toast.success('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(res.message || 'Failed to change password')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-maroon-600" />
          Portal Settings & Security
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal credentials, verify active security tokens, and configure preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Quick Profile Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-maroon-500 to-amber-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-md">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">{user?.name}</h3>
            <p className="text-xs text-maroon-600 dark:text-maroon-400 font-bold uppercase mt-1">{user?.role?.replace('_', ' ')}</p>
            
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 text-left text-xs space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                <span className="font-semibold text-gray-950 dark:text-white truncate max-w-[140px]" title={user?.email}>{user?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Account status:</span>
                <span className="bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Active
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-sm font-bold dark:text-white flex items-center gap-1.5 mb-4">
              <Shield className="w-4 h-4 text-maroon-600" />
              Two-Factor Authentication
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Google Authenticator (2FA)</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Secure logins with verification codes.</p>
              </div>
              <button 
                onClick={() => {
                  setTfa(!tfa)
                  toast.success(`Two-Factor Authentication ${!tfa ? 'Enabled' : 'Disabled'} (Mocked)`)
                }}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-300 ${tfa ? 'bg-maroon-600' : 'bg-gray-300 dark:bg-white/10'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${tfa ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Security Password Reset Form */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-sm font-bold dark:text-white flex items-center gap-1.5 mb-6">
              <KeyRound className="w-4 h-4 text-maroon-600" />
              Update Account Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                <input 
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full text-sm rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input 
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full text-sm rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                <input 
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-sm rounded-lg border-gray-300 dark:border-white/10 dark:bg-navy-950 dark:text-white px-4 py-2 focus:ring-maroon-500 focus:border-maroon-500"
                />
              </div>
              
              <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-white/5">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-maroon-600 hover:bg-maroon-700 disabled:bg-maroon-400 text-white px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors"
                >
                  {loading ? 'Changing password...' : 'Save New Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
