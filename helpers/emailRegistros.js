import nodemailer from 'nodemailer' 

const emailRegistro = async(datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // aqui es donde vamos a enviar el email 1 - Tomamos los datos 
      const { email, nombre, token  } = datos

      const info = await transporter.sendMail({
        from: "APV - Administrados de Pacientes de Veterinarios",
        to: email,
        subject: "comprueba tu cuenta en APV",
        text: "comprueba tu cuenta en APV",
        html: `<p>Hola: ${nombre}, Comprueba tu cuenta en APV.</p>
        <p>Tu cuenta ya esta lista, Solo debes comprobarla en el seguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprueba cuenta</a> </p>
        
        <p>Si tu no create esta cuenta puedes ignorar este mensaje</p>`
      });

      // Esto se va a mostrar en el servidor cuendo se envie el email
      console.log("Mensaje enviado: %s", info.messageId)

}

export default(emailRegistro)