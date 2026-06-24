/**
 * CIGMA API Client
 * Central helper for all backend calls.
 * – Auto-injects Authorization header via stored access token
 * – Wraps all endpoints used by the public-facing site
 */

const BASE = import.meta.env.VITE_API_URL ?? '/api'

// ─── Token storage (kept in module scope so AuthContext can update it) ────
let _accessToken: string | null = null
export const setAccessToken = (t: string | null) => { _accessToken = t }
export const getAccessToken  = () => _accessToken

// ─── Core fetch wrapper ──────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  const data = await res.json().catch(() => ({ success: false, message: res.statusText }))

  if (!res.ok) {
    throw new Error(data?.message ?? `HTTP ${res.status}`)
  }
  return data as T
}

// ─── Helpers ─────────────────────────────────────────────────────────────
export const get  = <T = any>(path: string) => request<T>(path, { method: 'GET' })
export const post = <T = any>(path: string, body: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) })
export const put = <T = any>(path: string, body: unknown) =>
  request<T>(path, { method: 'PUT', body: JSON.stringify(body) })

// ─── Auth ─────────────────────────────────────────────────────────────────
export const authApi = {
  login: (loginId: string, password: string) =>
    post<{ success: boolean; accessToken: string; user: Record<string, unknown> }>('/auth/login', { loginId, password }),

  logout: () => request('/auth/logout', { method: 'POST' }),

  refresh: () => request<{ accessToken: string }>('/auth/refresh', { method: 'POST' }),

  me: () => get<{ success: boolean; data: { id: string; name: string; email: string; role: string; avatar?: string; referenceId?: string; referenceData?: any } }>('/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    post<{ success: boolean; message: string }>('/auth/change-password', { currentPassword, newPassword }),
}

// ─── Dashboard ────────────────────────────────────────────────────────────
export const dashboardApi = {
  getAdminStats: () => get<{ success: boolean; data: any }>('/dashboard/admin/stats'),
}

// ─── Inquiries (Contact & Admission forms) ────────────────────────────────
export interface InquiryPayload {
  name: string
  phone: string
  message: string
  email?: string
  parentName?: string
  grade?: string
  subject?: string
  type?: 'general' | 'admission' | 'contact'
}

export const inquiriesApi = {
  submit: (payload: InquiryPayload) =>
    post<{ success: boolean; message: string; data: string }>('/inquiries', payload),
}

// ─── Job Applications (Career page) ───────────────────────────────────────
export interface ApplicationPayload {
  name: string
  email: string
  phone: string
  position: string
  qualification: string
  experience: string
  coverLetter: string
  cvUrl?: string
}

export const applicationsApi = {
  submit: (payload: ApplicationPayload) =>
    post<{ success: boolean; message: string; data: string }>('/applications', payload),
}

// ─── News ─────────────────────────────────────────────────────────────────
export interface NewsItem {
  _id: string
  title: string
  // Backend uses 'body', also accept 'content' for flexibility
  body?: string
  content?: string
  excerpt?: string
  category: string
  // Backend uses 'publishDate', also accept 'publishedAt'
  publishDate?: string
  publishedAt?: string
  imageUrl?: string
  coverImage?: string
  pdfUrl?: string
  tags?: string[]
  isPublished: boolean
  author?: string
}

export const newsApi = {
  list: (params?: { category?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams()
    if (params?.category) qs.set('category', params.category)
    if (params?.page)     qs.set('page', String(params.page))
    if (params?.limit)    qs.set('limit', String(params.limit))
    const q = qs.toString()
    return get<{ success: boolean; data: NewsItem[]; total: number; pages: number }>(
      `/news${q ? `?${q}` : ''}`,
    )
  },
}

// ─── Gallery ──────────────────────────────────────────────────────────────
export interface GalleryItem {
  _id: string
  // Backend uses 'url' and 'caption', frontend may also receive these names
  url?: string
  imageUrl?: string
  publicId?: string
  caption?: string
  title?: string
  thumbnailUrl?: string
  category: string
  description?: string
  date?: string
}

export const galleryApi = {
  list: (params?: { category?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams()
    if (params?.category) qs.set('category', params.category)
    if (params?.page)     qs.set('page', String(params.page))
    if (params?.limit)    qs.set('limit', String(params.limit))
    const q = qs.toString()
    return get<{ success: boolean; data: GalleryItem[]; total: number }>(
      `/gallery${q ? `?${q}` : ''}`,
    )
  },
}

// ─── Downloads ────────────────────────────────────────────────────────────
export interface DownloadItem {
  _id: string
  title: string
  description?: string
  fileUrl: string
  category: string
  fileSize?: string
  createdAt: string
}

export const downloadsApi = {
  list: (params?: { category?: string }) => {
    const qs = new URLSearchParams()
    if (params?.category) qs.set('category', params.category)
    const q = qs.toString()
    return get<{ success: boolean; data: DownloadItem[] }>(
      `/downloads${q ? `?${q}` : ''}`,
    )
  },
}

// ─── Attendance ───────────────────────────────────────────────────────────
export const attendanceApi = {
  getAnalytics: () => get<{ success: boolean; data: Record<string, unknown> }>('/attendance/analytics'),
  getClassAttendance: (classId: string, date?: string) => 
    get<{ success: boolean; data: any[] }>(`/attendance/class/${classId}${date ? `?date=${date}` : ''}`),
  getStudentAttendance: (studentId: string, month?: number, year?: number) => {
    let url = `/attendance/student/${studentId}`
    if (month && year) url += `?month=${month}&year=${year}`
    return get<{ success: boolean; data: { records: any[]; summary: any } }>(url)
  },
  markAttendance: (classId: string, date: string, records: any[]) =>
    post<{ success: boolean }>('/attendance', { classId, date, records }),
  updateAttendance: (id: string, status: string, remarks?: string) =>
    put<{ success: boolean }>(`/attendance/${id}`, { status, remarks }),
}

// ─── Marks ────────────────────────────────────────────────────────────────
export const marksApi = {
  getAnalytics: () => get<{ success: boolean; data: any }>('/marks/analytics'),
  getClassMarks: (classId: string, subject?: string, exam?: string, academicYear?: string) => {
    const qs = new URLSearchParams()
    if (subject) qs.set('subject', subject)
    if (exam) qs.set('exam', exam)
    if (academicYear) qs.set('academicYear', academicYear)
    const q = qs.toString()
    return get<{ success: boolean; data: any[] }>(`/marks/class/${classId}${q ? `?${q}` : ''}`)
  },
  getStudentMarks: (studentId: string, exam?: string, academicYear?: string) => {
    const qs = new URLSearchParams()
    if (exam) qs.set('exam', exam)
    if (academicYear) qs.set('academicYear', academicYear)
    const q = qs.toString()
    return get<{ success: boolean; data: any[] }>(`/marks/student/${studentId}${q ? `?${q}` : ''}`)
  },
  uploadMarks: (classId: string, subject: string, exam: string, academicYear: string, records: any[]) =>
    post<{ success: boolean; message?: string }>('/marks', { classId, subject, exam, academicYear, records }),
  editMark: (id: string, marksObtained: number, maxMarks: number) =>
    put<{ success: boolean; data: any }>(`/marks/${id}`, { marksObtained, maxMarks }),
}

// ─── Homework ─────────────────────────────────────────────────────────────
export const homeworkApi = {
  getClassHomework: (classId: string, subject?: string) => {
    const qs = new URLSearchParams()
    if (subject) qs.set('subject', subject)
    const q = qs.toString()
    return get<{ success: boolean; data: any[] }>(`/homework/class/${classId}${q ? `?${q}` : ''}`)
  },
  assignHomework: (payload: { title: string; description: string; classId: string; subject: string; dueDate: string; pdfUrl?: string }) =>
    post<{ success: boolean; data: any; message?: string }>('/homework', payload),
  deleteHomework: (id: string) =>
    request<{ success: boolean; message?: string }>(`/homework/${id}`, { method: 'DELETE' }),
}

// ─── Timetable ────────────────────────────────────────────────────────────
export const timetableApi = {
  getClassTimetable: (classId: string) =>
    get<{ success: boolean; data: any[] }>(`/timetable/class/${classId}`),
  getTeacherTimetable: (teacherId: string = 'me') =>
    get<{ success: boolean; data: any[] }>(`/timetable/teacher/${teacherId}`),
  createTimetable: (payload: { classId: string; day: string; period: number; subject: string; teacherId?: string; startTime: string; endTime: string }) =>
    post<{ success: boolean; data?: any; message?: string }>('/timetable', payload),
  deleteTimetable: (id: string) =>
    request(`/timetable/${id}`, { method: 'DELETE' }),
}

// ─── Fees ─────────────────────────────────────────────────────────────────
export const feesApi = {
  getAllFees: () => get<{ success: boolean; data: any[] }>('/fees/all'),
  getStudentFees: (studentId: string) => get<{ success: boolean; data: any[] }>(`/fees/student/${studentId}`),
  getMyFees: () => get<{ success: boolean; data: any[] }>('/fees/my'),
  // For generating a receipt open: window.open(`${BASE}/fees/receipt/${feeId}/${paymentId}`)
}

// ─── Parents ──────────────────────────────────────────────────────────────────
export const parentsApi = {
  getMyProfile: () => get<{ success: boolean; data: any }>('/parents/me'),
}

// ─── Notifications ────────────────────────────────────────────────────────
export const notificationApi = {
  getNotifications: () => get<{ success: boolean; data: any[] }>('/notifications'),
  markAsRead: (id: string) => put<{ success: boolean; data: any }>(`/notifications/${id}/read`, {}),
  createNotification: (payload: { title: string; message: string; targetAudience: string }) =>
    post<{ success: boolean; data: any }>('/notifications', payload),
}

// ─── Students & Teachers ──────────────────────────────────────────────────
export const studentsApi = {
  list: () => get<{ success: boolean; data: any[] }>('/students'),
  get: (id: string) => get<{ success: boolean; data: any }>(`/students/${id}`),
}

export const teachersApi = {
  list: () => get<{ success: boolean; data: any[] }>('/teachers'),
  get: (id: string) => get<{ success: boolean; data: any }>(`/teachers/${id}`),
  getMyClasses: () => get<{ success: boolean; data: { myClasses: any[]; allClasses: any[] } }>('/teachers/my-classes'),
  getClassStudents: (classId: string) => get<{ success: boolean; data: any[] }>(`/teachers/class-students/${classId}`),
}

export const academicsApi = {
  getClasses: () => get<{ success: boolean; data: any[] }>('/academics/classes'),
  getSubjects: () => get<{ success: boolean; data: any[] }>('/academics/subjects'),
}

export const aiApi = {
  getStudyPlan: (studentId: string) => get<{ success: boolean; data: any; message?: string }>(`/ai/study-plan/${studentId}`),
  getAssistantCommands: () => get<{ success: boolean; availableCommands: string[]; message?: string }>('/ai/assistant'),
  getParentInsights: (studentId: string) => get<{ success: boolean; data: any; message?: string }>(`/ai/parent-insights/${studentId}`),
  getWeeklySummary: (studentId: string) => get<{ success: boolean; data: any; message?: string }>(`/ai/parent-insights/${studentId}/weekly-summary`),
  getParentInsightsWidget: (studentId: string) => get<{ success: boolean; data: any; message?: string }>(`/ai/parent-insights/${studentId}/widget`),
  getAiAnalytics: () => get<{ success: boolean; data: any; message?: string }>('/ai/parent-insights/analytics'),
}
