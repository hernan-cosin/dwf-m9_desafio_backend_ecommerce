import { sgMail } from "lib/sendgrid";

export async function sendUserConfirmation(email, orderId) {
    try {
      const msg = {
        to: email,
        from: "hcosin@gmail.com", // Use the email address or domain you verified above
        subject: "Pago exitoso",
        html:
          '<div style=""><h3 style="font-family: sans-serif;">Se ha registrado un pago exitoso de tu compra numero: ' +
          orderId +
          '</h3><h1 style="font-family: san-serif;"></h1></div></div>"',
      };
  
      const sendgridResponse = await sgMail.send(msg);
  
      return sendgridResponse[0].statusCode;
    } catch (e) {
      console.log(e);
    }
}