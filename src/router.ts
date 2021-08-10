import express  from "express"
import AppointmentController from "./controllers/AppointmentController"
import ServiceController from "./controllers/ServiceController"
import authFirebase from "./middlewares/firebaseAuth"

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ msg: "oi" })
})

// USER ROUTES


// APPOINTMENT ROUTES
router.post('/appointment', authFirebase, AppointmentController.store)
router.get('/appointment', authFirebase, AppointmentController.index)
router.get('/appointment/:id', AppointmentController.show)
router.delete('/appointment/:id', AppointmentController.destroy)

// SERVICE ROUTES
router.post('/service', ServiceController.store)
router.get('/service', ServiceController.index)
router.delete('/service/:id', ServiceController.destroy)

export default router