import { error } from "console";
import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from '../helpers/emailRegistros.js'
import emailOlvidePassword from '../helpers/emailOlvidePassword.js'

const registrar = async (req, res) => {
    //console.log(req.body);
    const {email, nombre} = req.body;

    // revisar si el usuario ya existe
    const existeUsuario = await Veterinario.findOne({email})
    if(existeUsuario){
        //console.log(existeUsuario)
        const error = new Error('El correo que intenta registrar ya esta registrado')
        return res.status(401).json({msg: error.message});
    }

    try{
        // Guardar un nuevo veterinario.
        const veterinario = new Veterinario(req.body);
        const veterianaGuardado = await veterinario.save();

        // Aqui hacemos el envio del correo despues de guardar en la base de datos 
        emailRegistro({
            email, 
            nombre,
            token: veterianaGuardado.token,
        })


        res.json(veterianaGuardado)
    }catch(error){
        console.log(error)
    }
};

const perfil = (req, res) => {
    const { veterinario} = req; // esta variable se creo en el middleware y tiene la informacion del perfil al consultar desde postman vamos a tener los datos 
    res.json(veterinario) // al colocar perfil lo que hace es cambiar el nombre del objeto
};

const confirmar = async (req, res) => {
    const { token } = req.params;
  
    const usuarioConfirmar = await Veterinario.findOne({ token });
  
    if (!usuarioConfirmar) {
      const error = new Error("Token no válido");
      return res.status(404).json({ msg: error.message });
    }
  
    try {
      usuarioConfirmar.token = null;
      usuarioConfirmar.confirmado = true;
      await usuarioConfirmar.save();
  
      res.json({ msg: "Usuario Confirmado Correctamente" });
    } catch (error) {
      console.log(error);
    }
  };

const autenticar = async(req, res) => {
    const {email, password} = req.body;
    //comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email})
    //console.log(req.body)
    if(!usuario){
        //console.log(existeUsuario)
        const error = new Error('El usuario no existe')
        return res.status(404).json({msg: error.message});
    }
    // Comprobar su el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada')
        return res.status(403).json({msg: error.message})
    }
    // Revisar el password
    if(await usuario.comprobarPassword(password)){
        // cuando el usuario esta autentificado ahora le enviamos el token
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
        })


    }else{
        const error = new Error('password incorrecta')
        return res.status(403).json({msg: error.message})
    }

};

const olvidePassword = async(req, res) => {
    const {email} = req.body;
    console.log(email)
    // Validar en la base de datos 
    const existeVeterinario = await Veterinario.findOne({email})
    if(!existeVeterinario){
        const error = new Error('El usuario no existe')
        return res.status(400).json({msg: error.message})
    }
    // Si el usuario existe (lo guardamos en la base de datos) le enviamos un token despues lo hacemos con el correo 
    try{
        existeVeterinario.token = generarId()
        await existeVeterinario.save(); // lo guardamos

        // Aqui hacemos el envio del correo despues de guardar en la base de datos 
        emailOlvidePassword({
            email, 
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,
        })

        res.json({msg: "Hemos enviado un email con las instrucciones"})
    }catch (error){
        console.log(error)

    }

};

const comprobarToken = async(req, res) => {
    const {token} = req.params;
    //console.log(token)
    const tokenValido = await Veterinario.findOne({token});
    if(tokenValido){
        // el token es valido el usuaio existe no vamos a usar try porque no vamos a mandar nada a la base de datos 
        res.json({msg: "Token valido y el usuario existe"})
    }else {
        const error = new Error('Token no valido')
        return res.status(400).json({msg: error.message})
    }

};

const nuevoPassword = async(req, res) => {
    const { token } = req.params;
    console.log(token)
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token})
    if(!veterinario){
        const error = new Error("Hubo un error")
        return res.status(400).json({msg: error.message})
    }

    // En caso de que exista el token 
    try{
        //console.log(veterinario);
        veterinario.token = null // limpiamos el token (para que no se use mas) // son de un solo uso
        veterinario.password = password  // 
        //console.log(veterinario);
        await veterinario.save();
        res.json({msg: 'El password fue modificado correctamente'});

    }catch (error) {
        console.log(error)

    }


};

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if (!veterinario) {
      const error = new Error("Hubo un error");
      return res.status(400).json({ msg: error.message });
    }
  
    const { email } = req.body;
    if (veterinario.email !== req.body.email) {
      const existeEmail = await Veterinario.findOne({ email });
  
      if (existeEmail) {
        const error = new Error("Ese email ya esta en uso");
        return res.status(400).json({ msg: error.message });
      }
    }
  
    try {
      veterinario.nombre = req.body.nombre;
      veterinario.email = req.body.email;
      veterinario.web = req.body.web;
      veterinario.telefono = req.body.telefono;
  
      const veterianrioActualizado = await veterinario.save();
      res.json(veterianrioActualizado);
    } catch (error) {
      console.log(error);
    }
  };
  
  const actualizarPassword = async (req, res) => {
    // Leer los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;
  
    // Comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
      const error = new Error("Hubo un error");
      return res.status(400).json({ msg: error.message });
    }
  
    // Comprobar su password
    if (await veterinario.comprobarPassword(pwd_actual)) {
      // Almacenar el nuevo password
  
      veterinario.password = pwd_nuevo;
      await veterinario.save();
      res.json({ msg: "Password Almacenado Correctamente" });
    } else {
      const error = new Error("El Password Actual es Incorrecto");
      return res.status(400).json({ msg: error.message });
    }
  };


export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken, 
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}