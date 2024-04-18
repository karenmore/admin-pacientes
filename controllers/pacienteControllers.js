import { error } from "console";
import Paciente from '../models/Paciente.js'

const agregarPaciente = async(req, res) => {
    
    const paciente = new Paciente(req.body); // 1- creamos una instancia del modelo de paciente y guardamos en paciente lo que viene del body
    //console.log(paciente) // 2 - validando la ruta
    paciente.veterinario = req.veterinario._id // aqui estamos buscando el id del veterinario y lo guardamos en ese campo 

    // ahora hacemos un try para guardar en la base de datos, pero debe estar relacionado con el veterinario

    try {

        //console.log(req.veterinario._id) // 3- Aqui podemos usar req.veterinario porque en el router estoy usando el checkAuth y esto primero valida si esta autenticado el veterinario 
        // 3- Lo que hacemos con este id sera hacer la relacion 
        // 4 - Aqui dentro del try guardamos en la base de datos el paciente 
        const pacienteAlmacenado = await paciente.save();
        res.json({pacienteAlmacenado}) // importante esto, aqui ese res.json es lo que estoy viendo en el postman


    } catch (error) {
        console.log(error)
    }
}

const obtenerPacientes = async(req, res) => {
    const pacientes = await Paciente.find() // aqui estamos buscando todos
    .where('veterinario') // aqui usamos el campo que esta en paciente 
    .equals(req.veterinario); // aqui lo buscamos por el veterinario --> Estamos usando la variable de sesion del servidor express

    res.json(pacientes) // si lo coloco entre {} me crea como un encabezado con el nombre de pacientes sino me manda el json solito


}

const obtenerPaciente = async(req, res) => {

    // 1- comprobar la ruta console.log(req.params.id);
    // 2- tomaremos el id del parametro
    const { id } = req.params;
    const paciente = await Paciente.findById(id) // Lo buscamos en la base de datos
    //console.log(paciente) // lo que viene de la base de datos

    if(!paciente){
        res.status(404).json({msg: 'No encontrado'})
    }

    //console.log(paciente.veterinario._id); // validando lo que trae
    //console.log(req.veterinario._id);

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){ // Validamos si el veterinario es diferente al que esta autenticado (req.veterinario._id 'aqui vemos quien esta autenticado') toString hacer esto simpre para poder comparar
       return res.json({msg: 'Accion no valida'})  
    }

    if(paciente){
        res.json(paciente)
    }

    //res.json()
}

const actualizarPaciente = async(req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        res.status(404).json({msg: "No encontrado"})
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: "Accion no valida"})
    }
        // actualizar paciente

        // aqui los vamos a colocar todos si el cliente no manda update de un campo entonces queda el que ya tenia
        paciente.nombre = req.body.nombre || paciente.nombre;
        paciente.propietario = req.body.propietario || paciente.propietario;
        paciente.email = req.body.email || paciente.email;
        paciente.fecha = req.body.fecha || paciente.fecha;
        paciente.sintomas = req.body.sintomas || paciente.sintomas;

        try{
            const pacienteActualizado = await paciente.save();
            res.json(pacienteActualizado)

        }catch (error){
            console.log(error)
        }
};

const eliminarPaciente = async(req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente){
        res.status(404).json({msg: "No encontrado"})
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: "Accion no valida"})
    }

    try{
        await paciente.deleteOne()
        res.json({msg: "Paciente Eliminado"})

    }catch(error) {
        console.log(error)

    }
}


export {
    agregarPaciente, 
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}