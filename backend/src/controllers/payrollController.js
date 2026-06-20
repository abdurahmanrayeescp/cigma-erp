import { Payroll, Teacher } from '../models/index.js'

export const getPayrollRecords = async (req, res) => {
  try {
    const { month } = req.query
    const query = month ? { month } : {}
    const records = await Payroll.find(query).populate('employeeId', 'name employeeId department')
    res.json({ success: true, data: records })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const generatePayroll = async (req, res) => {
  try {
    const { month } = req.body

    // Find all active teachers
    const teachers = await Teacher.find({ isActive: true })

    const operations = teachers.map(teacher => {
      const basicSalary = teacher.salary || 30000 // default fallback
      const allowances = 5000 // demo value
      const deductions = 1500 // demo value
      const netSalary = basicSalary + allowances - deductions

      return {
        updateOne: {
          filter: { employeeId: teacher._id, month },
          update: {
            $set: {
              employeeId: teacher._id,
              month,
              basicSalary,
              allowances,
              deductions,
              netSalary,
              status: 'pending'
            }
          },
          upsert: true
        }
      }
    })

    if (operations.length > 0) {
      await Payroll.bulkWrite(operations)
    }

    res.json({ success: true, message: `Payroll generated for ${month}` })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const processPayment = async (req, res) => {
  try {
    const { id } = req.params
    const payroll = await Payroll.findById(id)
    if (!payroll) return res.status(404).json({ success: false, message: 'Payroll record not found' })

    payroll.status = 'paid'
    payroll.paymentDate = new Date()
    await payroll.save()

    res.json({ success: true, data: payroll })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getTeacherPayslips = async (req, res) => {
  try {
    const employeeId = req.params.employeeId
    const records = await Payroll.find({ employeeId }).sort({ createdAt: -1 })
    res.json({ success: true, data: records })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
