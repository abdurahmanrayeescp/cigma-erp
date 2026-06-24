/**
 * Voice commands router and permissions mapper for CIGMA ERP Voice Assistant.
 */

export interface ParsedCommand {
  action: 'route' | 'query' | 'unknown';
  route?: string;
  queryType?: 'attendance' | 'homework' | 'marks' | 'timetable';
  speakText: string;
}

// Maps command keywords to system routes and checks role permissions
export function handleVoiceCommand(transcript: string, role: string): ParsedCommand {
  const t = transcript.toLowerCase().trim();

  // Helper to verify role permission
  const checkPermission = (allowedRoles: string[]): boolean => {
    return allowedRoles.includes(role);
  };

  // 1. Direct Queries using Live API Data
  if (t.includes('attendance percentage') || t.includes('how is my attendance') || t.includes('show my attendance') || t.includes('what is my attendance')) {
    if (checkPermission(['STUDENT', 'PARENT'])) {
      return {
        action: 'query',
        queryType: 'attendance',
        speakText: 'Fetching the latest attendance percentage from live records...'
      };
    } else {
      return {
        action: 'unknown',
        speakText: 'Sorry, attendance queries via voice assistant are only available for students and parents.'
      };
    }
  }

  if (t.includes('pending homework') || t.includes('homework count') || t.includes('how many homework') || t.includes('pending assignments')) {
    if (checkPermission(['STUDENT', 'PARENT', 'TEACHER'])) {
      return {
        action: 'query',
        queryType: 'homework',
        speakText: 'Checking live homework records...'
      };
    } else {
      return {
        action: 'unknown',
        speakText: 'Sorry, homework queries are only available for student, parent, and teacher portals.'
      };
    }
  }

  if (t.includes('average marks') || t.includes('my average marks') || t.includes('my average grade') || t.includes('what are my marks')) {
    if (checkPermission(['STUDENT', 'PARENT'])) {
      return {
        action: 'query',
        queryType: 'marks',
        speakText: 'Calculating average marks from live academic results...'
      };
    } else {
      return {
        action: 'unknown',
        speakText: 'Average marks calculation is only available for student and parent profiles.'
      };
    }
  }

  if (t.includes('today\'s timetable') || t.includes('timetable today') || t.includes('classes today') || t.includes('schedule today')) {
    if (checkPermission(['STUDENT', 'PARENT', 'TEACHER'])) {
      return {
        action: 'query',
        queryType: 'timetable',
        speakText: 'Checking today\'s classes from the live timetable...'
      };
    } else {
      return {
        action: 'unknown',
        speakText: 'Timetable queries are only available for student, parent, and teacher roles.'
      };
    }
  }

  // 2. Navigation Routing Commands
  // Study Plan
  if (t.includes('study plan') || t.includes('study-plan')) {
    if (checkPermission(['STUDENT', 'PARENT', 'TEACHER'])) {
      const portal = role.toLowerCase();
      return {
        action: 'route',
        route: `/portal/${portal}/study-plan`,
        speakText: 'Opening your AI Study Plan page.'
      };
    }
  }

  // Dashboard
  if (t.includes('dashboard') || t.includes('go to home')) {
    const portal = role === 'SUPER_ADMIN' ? 'admin' : role.toLowerCase();
    return {
      action: 'route',
      route: `/portal/${portal}`,
      speakText: 'Opening your dashboard.'
    };
  }

  // Attendance
  if (t.includes('attendance')) {
    if (checkPermission(['STUDENT', 'PARENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'])) {
      const portal = role === 'SUPER_ADMIN' ? 'admin' : role.toLowerCase();
      return {
        action: 'route',
        route: `/portal/${portal}/attendance`,
        speakText: 'Opening attendance tracker.'
      };
    }
  }

  // Homework
  if (t.includes('homework') || t.includes('assignments')) {
    if (checkPermission(['STUDENT', 'PARENT', 'TEACHER'])) {
      const portal = role.toLowerCase();
      return {
        action: 'route',
        route: `/portal/${portal}/homework`,
        speakText: 'Opening homework list.'
      };
    }
  }

  // Results / Marks
  if (t.includes('results') || t.includes('marks') || t.includes('grades') || t.includes('performance')) {
    if (checkPermission(['STUDENT', 'PARENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'])) {
      const portal = role === 'SUPER_ADMIN' || role === 'ADMIN' ? 'admin/marks' : role === 'PARENT' ? 'parent/results' : role === 'STUDENT' ? 'student/results' : 'teacher/marks';
      return {
        action: 'route',
        route: `/portal/${portal}`,
        speakText: 'Opening academic results.'
      };
    }
  }

  // Timetable
  if (t.includes('timetable') || t.includes('schedule')) {
    if (checkPermission(['STUDENT', 'PARENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'])) {
      const portal = role === 'SUPER_ADMIN' ? 'admin' : role.toLowerCase();
      return {
        action: 'route',
        route: `/portal/${portal}/timetable`,
        speakText: 'Opening your timetable.'
      };
    }
  }

  // Fees
  if (t.includes('fees') || t.includes('payments')) {
    if (checkPermission(['PARENT', 'ADMIN', 'SUPER_ADMIN'])) {
      const portal = role === 'SUPER_ADMIN' ? 'admin' : role.toLowerCase();
      return {
        action: 'route',
        route: `/portal/${portal}/fees`,
        speakText: 'Opening fees overview.'
      };
    }
  }

  // Library
  if (t.includes('library') || t.includes('books')) {
    if (checkPermission(['STUDENT', 'ADMIN', 'SUPER_ADMIN'])) {
      const portal = role === 'SUPER_ADMIN' ? 'admin' : role.toLowerCase();
      return {
        action: 'route',
        route: `/portal/${portal}/library`,
        speakText: 'Opening library catalog.'
      };
    }
  }

  // Transport
  if (t.includes('transport') || t.includes('bus')) {
    if (checkPermission(['ADMIN', 'SUPER_ADMIN'])) {
      return {
        action: 'route',
        route: '/portal/admin/transport',
        speakText: 'Opening transport panel.'
      };
    }
  }

  // Payroll
  if (t.includes('payroll') || t.includes('salary') || t.includes('payslip')) {
    if (checkPermission(['ADMIN', 'SUPER_ADMIN'])) {
      return {
        action: 'route',
        route: '/portal/admin/payroll',
        speakText: 'Opening payroll records.'
      };
    } else if (checkPermission(['TEACHER'])) {
      return {
        action: 'route',
        route: '/portal/teacher/payslips',
        speakText: 'Opening your teacher payslips.'
      };
    }
  }

  // Settings
  if (t.includes('settings') || t.includes('configuration')) {
    if (checkPermission(['ADMIN', 'SUPER_ADMIN'])) {
      return {
        action: 'route',
        route: '/portal/admin/settings',
        speakText: 'Opening portal settings.'
      };
    }
  }

  // Audit Logs
  if (t.includes('audit logs') || t.includes('system logs') || t.includes('activity logs')) {
    if (checkPermission(['ADMIN', 'SUPER_ADMIN'])) {
      return {
        action: 'route',
        route: '/portal/admin/audit',
        speakText: 'Opening system audit logs.'
      };
    }
  }

  // Default fallback if query unrecognized or permissions fail
  return {
    action: 'unknown',
    speakText: `I heard "${transcript}", but it is not mapped or you do not have permissions to access it.`
  };
}
