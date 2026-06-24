async function runAiTests() {
  const base = 'http://localhost:5000/api'
  console.log('🏁 Starting AI Study Plan & Assistant API verification tests...\n')

  try {
    // 1. Authenticate as Admin
    console.log('🔑 Logging in as Admin...')
    const adminLoginRes = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId: 'admin', password: 'password123' })
    })
    const adminLogin = await adminLoginRes.json()
    if (!adminLogin.success) {
      console.error('❌ Admin login failed:', adminLogin)
      process.exit(1)
    }
    const adminToken = adminLogin.accessToken
    const adminHeaders = {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    }
    console.log('✅ Admin logged in successfully.\n')

    // 2. Fetch student list to get valid student IDs
    console.log('👥 Fetching students list...')
    const studentsRes = await fetch(`${base}/students`, { headers: adminHeaders })
    const studentsData = await studentsRes.json()
    if (!studentsData.success || !studentsData.data || studentsData.data.length === 0) {
      console.error('❌ Failed to get students list:', studentsData)
      process.exit(1)
    }

    const firstStudent = studentsData.data[0]
    const secondStudent = studentsData.data[1]
    const student1Id = firstStudent._id
    const student2Id = secondStudent._id
    console.log(`   Found student 1: ${firstStudent.name} (${student1Id}), Username: ${firstStudent.admissionNo}`)
    console.log(`   Found student 2: ${secondStudent.name} (${student2Id}), Username: ${secondStudent.admissionNo}\n`)

    // 3. Test GET /api/ai/assistant (commands endpoint)
    console.log('🎙️ Testing Voice Assistant commands endpoint (GET /api/ai/assistant)...')
    const assistantRes = await fetch(`${base}/ai/assistant`, { headers: adminHeaders })
    const assistantData = await assistantRes.json()
    console.log(`   Status: ${assistantRes.status}, success: ${assistantData.success}`)
    console.log(`   Available Commands:`, assistantData.availableCommands)
    if (!assistantData.success || !Array.isArray(assistantData.availableCommands)) {
      console.error('❌ Failed: Invalid assistant commands output')
      process.exit(1)
    }
    console.log('✅ Assistant commands endpoint verified.\n')

    // 4. Test GET /api/ai/study-plan/:studentId (study plan compilation)
    console.log(`🧠 Testing Study Plan for Student 1 as Admin (GET /api/ai/study-plan/${student1Id})...`)
    const planRes = await fetch(`${base}/ai/study-plan/${student1Id}`, { headers: adminHeaders })
    const planData = await planRes.json()
    console.log(`   Status: ${planRes.status}, success: ${planData.success}`)
    if (!planData.success || !planData.data) {
      console.error('❌ Failed to generate study plan:', planData)
      process.exit(1)
    }
    console.log(`   Student Name: ${planData.data.studentName}`)
    console.log(`   Attendance Rate: ${planData.data.attendance}%`)
    console.log(`   Risk Level: ${planData.data.riskLevel}`)
    console.log(`   Weekly Plan days count: ${planData.data.weeklyPlan?.length}`)
    console.log(`   AI Recommendations count: ${planData.data.recommendations?.length}`)
    console.log('✅ Study Plan compilation verified.\n')

    // 5. Test GET /api/ai/study-plan/:studentId/pdf (study plan PDF download)
    console.log(`📄 Testing Study Plan PDF export (GET /api/ai/study-plan/${student1Id}/pdf)...`)
    const pdfRes = await fetch(`${base}/ai/study-plan/${student1Id}/pdf`, { headers: adminHeaders })
    console.log(`   Status: ${pdfRes.status}, Content-Type: ${pdfRes.headers.get('content-type')}`)
    if (pdfRes.status !== 200 || pdfRes.headers.get('content-type') !== 'application/pdf') {
      console.error('❌ Failed: PDF export response was invalid')
      process.exit(1)
    }
    console.log('✅ Study Plan PDF export verified.\n')

    // 6. Test Student Login and RBAC access restrictions
    console.log(`🔑 Logging in as Student 1 (${firstStudent.admissionNo})...`)
    const studentLoginRes = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId: firstStudent.admissionNo, password: 'password123' })
    })
    const studentLogin = await studentLoginRes.json()
    if (!studentLogin.success) {
      console.error(`❌ Student login failed for ${firstStudent.admissionNo}:`, studentLogin)
      process.exit(1)
    }
    const studentToken = studentLogin.accessToken
    const studentHeaders = {
      'Authorization': `Bearer ${studentToken}`,
      'Content-Type': 'application/json'
    }
    console.log('✅ Student logged in successfully.\n')

    // 7. Verify Student 1 can access own study plan
    console.log(`🔒 Verifying Student 1 can access own study plan...`)
    const ownPlanRes = await fetch(`${base}/ai/study-plan/${student1Id}`, { headers: studentHeaders })
    const ownPlanData = await ownPlanRes.json()
    console.log(`   Status: ${ownPlanRes.status}, success: ${ownPlanData.success}`)
    if (ownPlanRes.status !== 200 || !ownPlanData.success) {
      console.error('❌ Failed: Student blocked from accessing own study plan')
      process.exit(1)
    }
    console.log('✅ Own study plan access allowed.\n')

    // 8. Verify Student 1 is blocked from accessing Student 2's study plan
    console.log(`🚫 Verifying Student 1 is blocked from Student 2's study plan (${student2Id})...`)
    const otherPlanRes = await fetch(`${base}/ai/study-plan/${student2Id}`, { headers: studentHeaders })
    const otherPlanData = await otherPlanRes.json()
    console.log(`   Status: ${otherPlanRes.status}, success: ${otherPlanData.success}`)
    if (otherPlanRes.status === 403) {
      console.log(`   Access correctly blocked: ${otherPlanData.message}`)
    } else {
      console.error('❌ Failed: Access was not blocked!', otherPlanData)
      process.exit(1)
    }
    console.log('✅ RBAC boundary restrictions verified.\n')

    console.log('🎉 All AI study plan and voice assistant API endpoints verified with zero errors!')
    process.exit(0)
  } catch (err) {
    console.error('❌ AI Test execution failed with error:', err)
    process.exit(1)
  }
}

runAiTests()
