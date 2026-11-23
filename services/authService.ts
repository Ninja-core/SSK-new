// =======================================================================
// SSK PROFESSIONAL COACHING CLASSES - AUTH SERVICE
// =======================================================================
// This service encapsulates all administrative authentication logic.
// Currently runs on a clean mock layer with SHA-256 hashed passwords
// and persistent local storage.
//
// =======================================================================
// [FIREBASE MIGRATION GUIDE]
// To connect real Firebase Authentication later:
// 1. Initialize Firebase: `import { getAuth, signInWithEmailAndPassword, ... } from 'firebase/auth'`
// 2. In login(): Map userId to email (e.g. `${userId}@sskcoaching.internal`) and call `signInWithEmailAndPassword(auth, email, password)`
// 3. In logout(): Call `signOut(auth)`
// 4. In getCurrentUser(): Read `auth.currentUser` and query Firestore `/admin_users/${uid}`
// 5. In createAdmin(): Call Firebase Admin SDK / Cloud Function to provision the user
// =======================================================================

import { defaultAdminSeed, AdminUserSeed } from '@/lib/seedData'

export interface AdminUser {
  id: string
  userId: string
  name: string
  role: 'Owner' | 'Admin'
  avatar: string
  createdAt: string
  lastLogin: string | null
  isDefaultPassword: boolean
  disabled: boolean
  createdBy?: string
}

export interface LoginCredentials {
  userId: string
  password: string
  rememberMe?: boolean
}

const STORAGE_KEY_ADMINS = 'ssk_admin_accounts_v1'
const STORAGE_KEY_PASSWORDS = 'ssk_admin_passwords_v1' // stored as SHA-256 hashes
const STORAGE_KEY_SESSION = 'ssk_admin_active_session_v1'
const SESSION_COOKIE_NAME = 'ssk_admin_logged_in'

// Fallback pure-JS SHA-256 hash implementation for client / SSR environments
async function sha256Hex(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(text)
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    } catch {
      // fallback below
    }
  }

  // Simple deterministic fallback hash representation for mock testing
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return `mock_sha256_${Math.abs(hash)}_${text.length}`
}

class AuthService {
  private memoryAdmins: AdminUser[] = []
  private memoryPasswords: Record<string, string> = {}
  private currentSessionUser: AdminUser | null = null
  private listeners: Array<(user: AdminUser | null) => void> = []

  constructor() {
    this.initSeedData()
  }

  private isClient(): boolean {
    return typeof window !== 'undefined'
  }

  private async initSeedData() {
    if (!this.isClient()) {
      this.memoryAdmins = [defaultAdminSeed]
      const defaultHash = await sha256Hex('SSK@12345')
      this.memoryPasswords = { sskadmin: defaultHash }
      return
    }

    try {
      // 1. Initialize accounts
      const storedAdmins = localStorage.getItem(STORAGE_KEY_ADMINS)
      if (!storedAdmins) {
        localStorage.setItem(STORAGE_KEY_ADMINS, JSON.stringify([defaultAdminSeed]))
        this.memoryAdmins = [defaultAdminSeed]
      } else {
        this.memoryAdmins = JSON.parse(storedAdmins)
        // Auto-migrate default owner avatar if it still has old unsplash photo
        let migrated = false
        this.memoryAdmins = this.memoryAdmins.map((adm) => {
          if (adm.avatar?.includes('photo-1534528741775-53994a69daeb')) {
            migrated = true
            return { ...adm, avatar: '/image10-collar.png' }
          }
          return adm
        })
        if (migrated) {
          localStorage.setItem(STORAGE_KEY_ADMINS, JSON.stringify(this.memoryAdmins))
        }
      }

      // 2. Initialize passwords (hashed)
      const storedPasswords = localStorage.getItem(STORAGE_KEY_PASSWORDS)
      if (!storedPasswords) {
        const defaultHash = await sha256Hex('SSK@12345')
        const initial = { sskadmin: defaultHash }
        localStorage.setItem(STORAGE_KEY_PASSWORDS, JSON.stringify(initial))
        this.memoryPasswords = initial
      } else {
        this.memoryPasswords = JSON.parse(storedPasswords)
      }

      // 3. Restore session
      const storedSession = localStorage.getItem(STORAGE_KEY_SESSION) || sessionStorage.getItem(STORAGE_KEY_SESSION)
      if (storedSession) {
        const parsed = JSON.parse(storedSession)
        const match = this.memoryAdmins.find((u) => u.userId.toLowerCase() === parsed.userId.toLowerCase())
        if (match && !match.disabled) {
          this.currentSessionUser = match
          if (parsed.avatar?.includes('photo-1534528741775-53994a69daeb')) {
            if (localStorage.getItem(STORAGE_KEY_SESSION)) {
              localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(match))
            }
            if (sessionStorage.getItem(STORAGE_KEY_SESSION)) {
              sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(match))
            }
          }
          this.notifyListeners()
        }
      }
    } catch (e) {
      console.warn('[authService] Storage initialization error:', e)
    }
  }

  // ---------------------------------------------------------------------
  // AUTHENTICATION: LOGIN
  // ---------------------------------------------------------------------
  // CONNECT FIREBASE AUTH HERE:
  // In Firebase: signInWithEmailAndPassword(auth, `${userId}@sskcoaching.internal`, password)
  // ---------------------------------------------------------------------
  public async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    await this.initSeedData()

    const rawId = credentials.userId.trim()
    const cleanId = rawId.toLowerCase()
    const password = credentials.password

    if (!cleanId || !password) {
      return { success: false, error: 'Please enter both User ID and Password.' }
    }

    // Lookup user in mock registry
    const user = this.memoryAdmins.find((u) => u.userId.toLowerCase() === cleanId)
    if (!user) {
      return { success: false, error: 'Incorrect ID or password.' }
    }

    if (user.disabled) {
      return { success: false, error: 'This admin account has been deactivated. Please contact the owner.' }
    }

    // Verify hashed password
    const hashedAttempt = await sha256Hex(password)
    const storedHash = this.memoryPasswords[cleanId]

    if (storedHash !== hashedAttempt) {
      return { success: false, error: 'Incorrect ID or password.' }
    }

    // Update last login timestamp
    user.lastLogin = new Date().toISOString()
    this.saveAdmins()

    // Persist session
    this.currentSessionUser = user
    const sessionData = JSON.stringify({
      id: user.id,
      userId: user.userId,
      name: user.name,
      role: user.role,
      loginAt: user.lastLogin,
    })

    if (this.isClient()) {
      if (credentials.rememberMe) {
        localStorage.setItem(STORAGE_KEY_SESSION, sessionData)
      } else {
        sessionStorage.setItem(STORAGE_KEY_SESSION, sessionData)
      }
      document.cookie = `${SESSION_COOKIE_NAME}=true; path=/; max-age=86400; SameSite=Lax`
    }

    this.notifyListeners()
    return { success: true, user }
  }

  // ---------------------------------------------------------------------
  // AUTHENTICATION: LOGOUT
  // ---------------------------------------------------------------------
  // CONNECT FIREBASE AUTH HERE:
  // In Firebase: signOut(auth)
  // ---------------------------------------------------------------------
  public async logout(): Promise<void> {
    this.currentSessionUser = null
    if (this.isClient()) {
      localStorage.removeItem(STORAGE_KEY_SESSION)
      sessionStorage.removeItem(STORAGE_KEY_SESSION)
      document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
    this.notifyListeners()
  }

  // ---------------------------------------------------------------------
  // SESSION OBSERVATION
  // ---------------------------------------------------------------------
  public getCurrentUser(): AdminUser | null {
    if (this.currentSessionUser) return this.currentSessionUser
    if (this.isClient()) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_SESSION) || sessionStorage.getItem(STORAGE_KEY_SESSION)
        if (stored) {
          const parsed = JSON.parse(stored)
          const match = this.memoryAdmins.find((u) => u.userId.toLowerCase() === parsed.userId.toLowerCase())
          if (match && !match.disabled) {
            this.currentSessionUser = match
            return match
          }
        }
      } catch {
        return null
      }
    }
    return null
  }

  public onAuthStateChanged(callback: (user: AdminUser | null) => void): () => void {
    this.listeners.push(callback)
    callback(this.getCurrentUser())
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback)
    }
  }

  private notifyListeners() {
    const user = this.getCurrentUser()
    this.listeners.forEach((cb) => {
      try {
        cb(user)
      } catch (e) {
        console.error('[authService] listener error:', e)
      }
    })
  }

  // ---------------------------------------------------------------------
  // ADMIN ACCOUNT MANAGEMENT (Only for logged-in admins)
  // ---------------------------------------------------------------------
  // CONNECT FIREBASE AUTH / FIRESTORE HERE:
  // In Firebase: Cloud Function creates user in Auth + adds doc to `/admin_users`
  // ---------------------------------------------------------------------
  public async listAdmins(): Promise<AdminUser[]> {
    await this.initSeedData()
    return [...this.memoryAdmins]
  }

  public async createAdmin(data: {
    name: string
    userId: string
    password: string
  }): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return { success: false, error: 'Unauthorized. Only logged-in administrators can create accounts.' }
    }

    const cleanUserId = data.userId.trim().toLowerCase()
    const cleanName = data.name.trim()

    if (!cleanName || !cleanUserId || !data.password) {
      return { success: false, error: 'All fields are required.' }
    }

    if (cleanUserId.length < 4) {
      return { success: false, error: 'User ID must be at least 4 characters.' }
    }

    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' }
    }

    // Check unique User ID
    const exists = this.memoryAdmins.some((a) => a.userId.toLowerCase() === cleanUserId)
    if (exists) {
      return { success: false, error: `User ID "${cleanUserId}" is already taken. Please choose another.` }
    }

    const newAdmin: AdminUser = {
      id: `admin_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: cleanUserId,
      name: cleanName,
      role: 'Admin',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=13321F&textColor=FAF5EC`,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      isDefaultPassword: false,
      disabled: false,
      createdBy: currentUser.userId,
    }

    const hash = await sha256Hex(data.password)
    this.memoryPasswords[cleanUserId] = hash
    this.memoryAdmins.push(newAdmin)

    this.saveAdmins()
    this.savePasswords()

    return { success: true, user: newAdmin }
  }

  public async deleteAdmin(targetUserId: string): Promise<{ success: boolean; error?: string }> {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return { success: false, error: 'Unauthorized.' }
    }

    const cleanId = targetUserId.toLowerCase()
    const target = this.memoryAdmins.find((a) => a.userId.toLowerCase() === cleanId)
    if (!target) {
      return { success: false, error: 'Account not found.' }
    }

    if (target.role === 'Owner' || target.userId.toLowerCase() === 'sskadmin') {
      return { success: false, error: 'The primary Owner account cannot be deleted.' }
    }

    if (target.userId.toLowerCase() === currentUser.userId.toLowerCase()) {
      return { success: false, error: 'You cannot delete your own active account.' }
    }

    this.memoryAdmins = this.memoryAdmins.filter((a) => a.userId.toLowerCase() !== cleanId)
    delete this.memoryPasswords[cleanId]

    this.saveAdmins()
    this.savePasswords()

    return { success: true }
  }

  public async toggleAdminStatus(targetUserId: string, disabled: boolean): Promise<{ success: boolean; error?: string }> {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return { success: false, error: 'Unauthorized.' }
    }

    const cleanId = targetUserId.toLowerCase()
    const target = this.memoryAdmins.find((a) => a.userId.toLowerCase() === cleanId)
    if (!target) {
      return { success: false, error: 'Account not found.' }
    }

    if (target.role === 'Owner' || target.userId.toLowerCase() === 'sskadmin') {
      return { success: false, error: 'The primary Owner account cannot be disabled.' }
    }

    target.disabled = disabled
    this.saveAdmins()

    return { success: true }
  }

  // ---------------------------------------------------------------------
  // PROFILE & PASSWORD EDITING (Own Account Only)
  // ---------------------------------------------------------------------
  public async updateProfile(
    userId: string,
    data: { name?: string; avatar?: string }
  ): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const currentUser = this.getCurrentUser()
    if (!currentUser || currentUser.userId.toLowerCase() !== userId.toLowerCase()) {
      return { success: false, error: 'You can only edit your own profile.' }
    }

    const cleanId = userId.toLowerCase()
    const target = this.memoryAdmins.find((a) => a.userId.toLowerCase() === cleanId)
    if (!target) {
      return { success: false, error: 'Account not found.' }
    }

    if (data.name && data.name.trim()) {
      target.name = data.name.trim()
    }
    if (data.avatar) {
      target.avatar = data.avatar
    }

    this.currentSessionUser = { ...target }
    this.saveAdmins()
    this.saveSession(this.currentSessionUser)
    this.notifyListeners()

    return { success: true, user: this.currentSessionUser }
  }

  public async changePassword(
    userId: string,
    currentPass: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string }> {
    const currentUser = this.getCurrentUser()
    if (!currentUser || currentUser.userId.toLowerCase() !== userId.toLowerCase()) {
      return { success: false, error: 'Unauthorized. You can only change your own password.' }
    }

    const cleanId = userId.toLowerCase()
    const currentHash = await sha256Hex(currentPass)
    const storedHash = this.memoryPasswords[cleanId]

    if (storedHash !== currentHash) {
      return { success: false, error: 'Current password does not match.' }
    }

    if (newPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' }
    }

    if (currentPass === newPass) {
      return { success: false, error: 'New password must be different from your current password.' }
    }

    // Update password
    const newHash = await sha256Hex(newPass)
    this.memoryPasswords[cleanId] = newHash

    // Clear default password warning flag
    const target = this.memoryAdmins.find((a) => a.userId.toLowerCase() === cleanId)
    if (target) {
      target.isDefaultPassword = false
      this.currentSessionUser = { ...target }
      this.saveAdmins()
      this.saveSession(this.currentSessionUser)
      this.notifyListeners()
    }

    this.savePasswords()
    return { success: true }
  }

  // ---------------------------------------------------------------------
  // PERSISTENCE HELPERS
  // ---------------------------------------------------------------------
  private saveAdmins() {
    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY_ADMINS, JSON.stringify(this.memoryAdmins))
      } catch (e) {
        console.warn('saveAdmins error:', e)
      }
    }
  }

  private savePasswords() {
    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY_PASSWORDS, JSON.stringify(this.memoryPasswords))
      } catch (e) {
        console.warn('savePasswords error:', e)
      }
    }
  }

  private saveSession(user: AdminUser) {
    if (this.isClient()) {
      const data = JSON.stringify({
        id: user.id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        loginAt: user.lastLogin,
      })
      if (localStorage.getItem(STORAGE_KEY_SESSION)) {
        localStorage.setItem(STORAGE_KEY_SESSION, data)
      }
      if (sessionStorage.getItem(STORAGE_KEY_SESSION)) {
        sessionStorage.setItem(STORAGE_KEY_SESSION, data)
      }
    }
  }
}

export const authService = new AuthService()
