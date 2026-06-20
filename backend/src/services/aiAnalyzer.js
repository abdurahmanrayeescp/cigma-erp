/**
 * Heuristic AI Analyzer Engine
 * Generates deterministic insights without requiring external LLM APIs.
 */

export const analyzeAttendance = (studentName, percentage, lastAbsences) => {
  let status = 'Excellent'
  let summary = ''

  if (percentage >= 95) {
    status = 'Excellent'
    summary = `${studentName} maintains an outstanding attendance record of ${percentage}%. Consistent presence strongly correlates with their academic success. Keep up the great work!`
  } else if (percentage >= 85) {
    status = 'Good'
    summary = `${studentName}'s attendance is currently at ${percentage}%. While this is acceptable, minimizing occasional absences will help them stay fully engaged with the curriculum.`
  } else if (percentage >= 75) {
    status = 'At Risk'
    summary = `${studentName}'s attendance has dropped to ${percentage}%. They are at risk of missing critical foundational concepts. We recommend scheduling a meeting to discuss any ongoing challenges.`
  } else {
    status = 'Critical'
    summary = `URGENT: ${studentName}'s attendance is critically low at ${percentage}%. Immediate intervention is required. Prolonged absence is severely impacting academic progression.`
  }

  // Factor in recent patterns if available
  if (lastAbsences && lastAbsences > 3) {
    summary += ` Note: We observed ${lastAbsences} absences recently, indicating a concerning short-term trend.`
  }

  return { status, summary }
}

export const analyzeMarks = (studentName, marksData) => {
  if (!marksData || marksData.length === 0) {
    return {
      status: 'Insufficient Data',
      summary: `Not enough academic data available to generate an insight for ${studentName}.`,
      strengths: [],
      weaknesses: []
    }
  }

  // Calculate Average
  const totalObtained = marksData.reduce((acc, curr) => acc + curr.obtained, 0)
  const totalMax = marksData.reduce((acc, curr) => acc + curr.max, 0)
  const average = (totalObtained / totalMax) * 100

  // Identify Strengths and Weaknesses
  const sortedSubjects = [...marksData].sort((a, b) => (b.obtained / b.max) - (a.obtained / a.max))
  const strengths = sortedSubjects.slice(0, 2).map(s => s.subject)
  const weaknesses = sortedSubjects.slice(-2).filter(s => (s.obtained / s.max) < 0.6).map(s => s.subject)

  let status = 'Satisfactory'
  let summary = ''

  if (average >= 90) {
    status = 'Exceptional'
    summary = `${studentName} is performing exceptionally well with an overall average of ${average.toFixed(1)}%. They show remarkable aptitude, particularly in ${strengths.join(' and ')}.`
  } else if (average >= 75) {
    status = 'Good'
    summary = `${studentName} shows strong academic performance averaging ${average.toFixed(1)}%. Continued focus will push them toward excellence.`
    if (weaknesses.length > 0) {
      summary += ` A little extra attention in ${weaknesses.join(' and ')} would be highly beneficial.`
    }
  } else if (average >= 60) {
    status = 'Average'
    summary = `${studentName} is maintaining an average of ${average.toFixed(1)}%. They are grasping the core concepts but need dedicated revision to improve.`
    if (weaknesses.length > 0) {
      summary += ` We strongly recommend remedial focus on ${weaknesses.join(' and ')}.`
    }
  } else {
    status = 'Needs Improvement'
    summary = `${studentName}'s overall performance is concerning at ${average.toFixed(1)}%. Immediate academic support and parent-teacher collaboration are recommended.`
    if (weaknesses.length > 0) {
      summary += ` Priority intervention needed for ${weaknesses.join(' and ')}.`
    }
  }

  return { status, summary, strengths, weaknesses }
}
