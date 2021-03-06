import express  from "express"
import AdminUserController from "./controllers/AdminUserController"
import AppointmentController from "./controllers/AppointmentController"
import AuthAdminController from "./controllers/AuthAdminController"
import ServiceController from "./controllers/ServiceController"
import ensureAdminAuthenticated from "./middlewares/adminAuth"
import authFirebase from "./middlewares/firebaseAuth"

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ msg: "oi" })
})

// ADMIN USER ROUTES
router.post('/admin/signup', AdminUserController.store)
router.post('/admin/signin', AuthAdminController.store)
router.get('/admin/test_middleware', ensureAdminAuthenticated, (req, res) => {
  const adminId = req.admin_user_id
  return res.json({ test: "OK", adminId })
})


// APPOINTMENT ROUTES
router.post('/appointment', authFirebase, AppointmentController.store)
router.get('/appointment', authFirebase, AppointmentController.index)
router.get('/appointment/:id', AppointmentController.show)
router.delete('/appointment/:id', AppointmentController.destroy)

// SERVICE ROUTES
router.post('/service', ServiceController.store)
router.get('/service', ServiceController.index)

export default router