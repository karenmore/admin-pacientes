import nodemailer from 'nodemailer' 

const emailOlvidePassword = async(datos) => {
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
        subject: "Restablece tu Password",
        text: "Restablece tu Password",
        html: `<p>Hola: ${nombre}, ha solicitado restablcer tu password.</p>
        <p>Sigue el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/olvide-Password/${token}">Restablecer Password</a> </p>
        
        <p>Si tu no create esta cuenta puedes ignorar este mensaje</p>`
      });

      // Esto se va a mostrar en el servidor cuendo se envie el email
      console.log("Mensaje enviado: %s", info.messageId)

}

export default(emailOlvidePassword)