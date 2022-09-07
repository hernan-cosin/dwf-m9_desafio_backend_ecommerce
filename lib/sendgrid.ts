import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function sendEmail(email: string, code: number) {
  const msg = {
    to: email,
    from: "hcosin@gmail.com", // Use the email address or domain you verified above
    subject: "Your access code",
    html:
      '<div style=""><h3 style="font-family: sans-serif;">Enter this code to acces: </h3><h1 style="font-family: san-serif;">' +
      code +
      "</h1></div></div>",
  };

  console.log(email, code);

  const sendgridResponse = await sgMail.send(msg);
  return sendgridResponse;
}

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

// export { sgMail };
