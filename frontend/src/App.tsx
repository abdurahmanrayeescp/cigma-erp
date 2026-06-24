import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'

// Pages
import Home from '@/pages/Home'
import About from '@/pages/About'
import PrincipalMessage from '@/pages/PrincipalMessage'
import ManagementMessage from '@/pages/ManagementMessage'
import Academics from '@/pages/Academics'
import Facilities from '@/pages/Facilities'
import Gallery from '@/pages/Gallery'
import NewsEvents from '@/pages/NewsEvents'
import Admissions from '@/pages/Admissions'
import Career from '@/pages/Career'
import Downloads from '@/pages/Downloads'
import FAQ from '@/pages/FAQ'
import Contact from '@/pages/Contact'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'

// Portal Dashboards (Stubs)
import AdminDashboard from '@/pages/portal/AdminDashboard'
import TeacherDashboard from '@/pages/portal/TeacherDashboard'
import ParentDashboard from '@/pages/portal/ParentDashboard'
import StudentDashboard from '@/pages/portal/StudentDashboard'
import StudentStudyPlanPage from '@/pages/portal/StudentStudyPlanPage'
import ParentInsightsPage from '@/pages/portal/ParentInsightsPage'
import AiAnalyticsDashboard from '@/pages/portal/AiAnalyticsDashboard'

// Attendance Pages
import TeacherAttendancePage from '@/pages/portal/TeacherAttendancePage'
import ParentAttendancePage from '@/pages/portal/ParentAttendancePage'
import StudentAttendancePage from '@/pages/portal/StudentAttendancePage'

// Marks Pages
import AdminMarksAnalytics from '@/pages/portal/AdminMarksAnalytics'
import TeacherMarksPage from '@/pages/portal/TeacherMarksPage'
import TeacherClassesPage from '@/pages/portal/TeacherClassesPage'
import ParentResultsPage from '@/pages/portal/ParentResultsPage'
import StudentResultsPage from '@/pages/portal/StudentResultsPage'

// Homework Pages
import TeacherHomeworkPage from '@/pages/portal/TeacherHomeworkPage'
import ParentHomeworkPage from '@/pages/portal/ParentHomeworkPage'
import StudentHomeworkPage from '@/pages/portal/StudentHomeworkPage'

// Timetable Pages
import TeacherTimetablePage from '@/pages/portal/TeacherTimetablePage'
import ParentTimetablePage from '@/pages/portal/ParentTimetablePage'
import StudentTimetablePage from '@/pages/portal/StudentTimetablePage'

// Fees Pages
import ParentFeesPage from '@/pages/portal/ParentFeesPage'
import AdminFeesPage from '@/pages/portal/AdminFeesPage'

// Notifications
import AdminNotificationsPage from '@/pages/portal/AdminNotificationsPage'

// Certificates
import AdminCertificatesPage from '@/pages/portal/AdminCertificatesPage'

// Reports
import AdminReportsPage from '@/pages/portal/AdminReportsPage'

// Library
import AdminLibraryPage from '@/pages/portal/AdminLibraryPage'
import StudentLibraryPage from '@/pages/portal/StudentLibraryPage'

// Transport
import AdminTransportPage from '@/pages/portal/AdminTransportPage'

// Payroll
import AdminPayrollPage from '@/pages/portal/AdminPayrollPage'
import TeacherPayslipPage from '@/pages/portal/TeacherPayslipPage'

// Audit
import AdminAuditLogsPage from '@/pages/portal/AdminAuditLogsPage'

// New Admin Portal Pages
import AdminStudentsPage from '@/pages/portal/AdminStudentsPage'
import AdminTeachersPage from '@/pages/portal/AdminTeachersPage'
import AdminAcademicsPage from '@/pages/portal/AdminAcademicsPage'
import AdminAttendancePage from '@/pages/portal/AdminAttendancePage'
import AdminTimetablePage from '@/pages/portal/AdminTimetablePage'
import AdminSettingsPage from '@/pages/portal/AdminSettingsPage'

// PWA Component
import PwaPrompt from '@/components/ui/PwaPrompt'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname.split('/')[1] || '/'}>
        {/* Public Website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/principal-message" element={<PrincipalMessage />} />
          <Route path="/management-message" element={<ManagementMessage />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/news-events" element={<NewsEvents />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/career" element={<Career />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ERP Portal */}
        <Route path="/portal" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="admin" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} />}>
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudentsPage />} />
              <Route path="teachers" element={<AdminTeachersPage />} />
              <Route path="academics" element={<AdminAcademicsPage />} />
              <Route path="attendance" element={<AdminAttendancePage />} />
              <Route path="marks" element={<AdminMarksAnalytics />} />
              <Route path="fees" element={<AdminFeesPage />} />
              <Route path="timetable" element={<AdminTimetablePage />} />
              <Route path="notifications" element={<AdminNotificationsPage />} />
              <Route path="certificates" element={<AdminCertificatesPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="library" element={<AdminLibraryPage />} />
              <Route path="transport" element={<AdminTransportPage />} />
              <Route path="payroll" element={<AdminPayrollPage />} />
              <Route path="audit" element={<AdminAuditLogsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="ai-analytics" element={<AiAnalyticsDashboard />} />
              <Route path="insights/:studentId" element={<ParentInsightsPage />} />
            </Route>
            <Route path="teacher" element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
              <Route index element={<TeacherDashboard />} />
              <Route path="attendance" element={<TeacherAttendancePage />} />
              <Route path="classes" element={<TeacherClassesPage />} />
              <Route path="marks" element={<TeacherMarksPage />} />
              <Route path="homework" element={<TeacherHomeworkPage />} />
              <Route path="timetable" element={<TeacherTimetablePage />} />
              <Route path="payslips" element={<TeacherPayslipPage />} />
              <Route path="study-plan" element={<StudentStudyPlanPage />} />
              <Route path="insights/:studentId" element={<ParentInsightsPage />} />
            </Route>
            <Route path="parent" element={<ProtectedRoute allowedRoles={['PARENT']} />}>
              <Route index element={<ParentDashboard />} />
              <Route path="attendance" element={<ParentAttendancePage />} />
              <Route path="results" element={<ParentResultsPage />} />
              <Route path="homework" element={<ParentHomeworkPage />} />
              <Route path="timetable" element={<ParentTimetablePage />} />
              <Route path="fees" element={<ParentFeesPage />} />
              <Route path="study-plan" element={<StudentStudyPlanPage />} />
              <Route path="insights/:studentId" element={<ParentInsightsPage />} />
            </Route>
            <Route path="student" element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
              <Route index element={<StudentDashboard />} />
              <Route path="attendance" element={<StudentAttendancePage />} />
              <Route path="results" element={<StudentResultsPage />} />
              <Route path="homework" element={<StudentHomeworkPage />} />
              <Route path="timetable" element={<StudentTimetablePage />} />
              <Route path="library" element={<StudentLibraryPage />} />
              <Route path="study-plan" element={<StudentStudyPlanPage />} />
              <Route path="insights/:studentId" element={<ParentInsightsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
        <Router>
          <ScrollToTop />
          <PwaPrompt />
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#0a0e30', color: '#fff', border: '1px solid #8B3A3A' },
            }}
          />
        </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
