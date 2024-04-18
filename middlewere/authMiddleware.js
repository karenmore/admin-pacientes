import  Jwt  from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const ckeckAuth = async(req, res, next) => {
    let token;
    
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        //console.log('si tiene el token con Bearer')
        // aqui estamos revisando si hay un token y si el token tienen Bearer pero ahora hay que ver si el token es valido

        try{
            token = req.headers.authorization.split(" ")[1]; // aqui lo que hago es conseguir el token
            //console.log(token)
            const decoded = Jwt.verify(token, process.env.JWT_SECRET)
            //console.log(decoded)
            req.veterinario = await Veterinario.findById(decoded.id).select(    // req.veterinario Esto hace que se cree una sesion con el veterinario
                "-password -token -confirmado"
            );
            //console.log(veterinario)
            return next(); // next hace que se vay al seguiente middel es decir a las seguientes rutas 
        }catch (error) {
            const e = new Error('Token no Valido')
            return res.status(403).json({msg: e.message});
        }
    }
    if(!token){
        const error = new Error('Token no Valido o inexistente')
        res.status(403).json({msg: error.message});
    }
    next(); // Despues se va al seguiente
};

export default ckeckAuth;