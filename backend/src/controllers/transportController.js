import { TransportRoute, Student } from '../models/index.js'

export const getRoutes = async (req, res) => {
  try {
    const routes = await TransportRoute.find().populate('students', 'name admissionNo')
    res.json({ success: true, data: routes })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createRoute = async (req, res) => {
  try {
    const { routeName, vehicleNumber, driverName, driverPhone, stops } = req.body
    const newRoute = new TransportRoute({
      routeName, vehicleNumber, driverName, driverPhone, stops
    })
    await newRoute.save()
    res.status(201).json({ success: true, data: newRoute })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const assignStudentToRoute = async (req, res) => {
  try {
    const { routeId, studentId } = req.body

    const route = await TransportRoute.findById(routeId)
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' })

    const student = await Student.findById(studentId)
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' })

    if (!route.students.includes(studentId)) {
      route.students.push(studentId)
      await route.save()
    }

    res.json({ success: true, data: route })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const removeStudentFromRoute = async (req, res) => {
  try {
    const { routeId, studentId } = req.body

    const route = await TransportRoute.findById(routeId)
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' })

    route.students = route.students.filter(id => id.toString() !== studentId.toString())
    await route.save()

    res.json({ success: true, data: route })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
