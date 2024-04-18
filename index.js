import express from "express"
import dotenv from 'dotenv'
import conectarDB from "./config/db.js"
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js"
import cors from 'cors'

const app = express();
app.use(express.json())

dotenv.config()

conectarDB();
const dominiosPermitidos  = [process.env.FRONTEND_URL]

const corsOption = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1 ){
            // El origen del request esta permitido
            callback(null, true)
        }else{
            callback(new Error('No permitido por CORS'))
        }
    }
}

//console.log(process.env.MONGO_URI)
app.use(cors(corsOption))

app.use('/api/veterinarios', veterinarioRoutes); 
app.use('/api/pacientes', pacienteRoutes); 

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor funcionando por el puerto ${PORT}`)
});