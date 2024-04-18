import Jwt  from "jsonwebtoken";

const generarJWT = (id) => {
    return Jwt.sign({id: id}, process.env.JWT_SECRET, {     // genera un nuevo json web token
        expiresIn: "30d",
    }) 
}

export default generarJWT;