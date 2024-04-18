import express from 'express'
import { registrar, perfil, confirmar, autenticar, olvidePassword , comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword} from '../controllers/veterinarioControllers.js'
import ckeckAuth from '../middlewere/authMiddleware.js'
const router = express.Router();

// area publica
router.post('/', registrar)
router.get('/confirmar/:token', confirmar)
router.post('/login', autenticar)
router.post('/olvide-password', olvidePassword)
//router.get('/olvide-password/:token', comprobarToken)
//router.post('/olvide-password/:token', nuevoPassword)  Estas dos se simplifican en la linea de abajo

router.route("/olvide-password/:token")
    .get(comprobarToken)
    .post(nuevoPassword)

// area pirvada
router.get('/perfil', ckeckAuth, perfil)
router.put('/perfil/:id', ckeckAuth, actualizarPerfil)
router.put("/actualizar-password", ckeckAuth, actualizarPassword);

export default router;