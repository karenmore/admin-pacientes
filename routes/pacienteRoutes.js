import express from 'express'
import {agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente} from '../controllers/pacienteControllers.js'
import checkAuth from '../middlewere/authMiddleware.js'

const router = express.Router();  // acedemos al router de express

router.route('/')
    .post(checkAuth, agregarPaciente) // aqui el endpoint esta protegido, el usuario debe esta autenticado para ver los pacientes 
    .get(checkAuth, obtenerPacientes)

router.route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)


export default router;