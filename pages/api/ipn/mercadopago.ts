import type { NextApiRequest, NextApiResponse } from "next";
import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "models/order";
import { User } from "models/user";
import { sgMail } from "lib/sendgrid";
import { base } from "lib/airtable";
import { getProductInformation } from "lib/mercadopago";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, topic } = req.query;

    if (topic == "merchant_order") {
      const order = await getMerchantOrder(id);

      // console.log(order);

      if (order.status == "closed") {
        const orderId = order.external_reference;

        // actualiza la orden en firebase
        const myOrder = new Order(orderId);
        await myOrder.get();
        myOrder.data.status = "closed";
        await myOrder.update();

        // envia la confirmación de compra por mail al usuario
        const userId = myOrder.data.userId;
        const email = await getUserEmail(userId);
        const sendUserConfirmationRes = await sendUserConfirmation(email, orderId);

        // obtiene información para crear registro en airtable para el vendedor
        const productId = myOrder.data.productId;
        const airtableProductId = await getProductInformation(productId);
        const paymentApprovedDate = new Date(order.payments[0].date_approved);

        // crea el registro en airtable
        const createAirtableConfirmationRes = await createAirtableConfirmation(
          airtableProductId.id,
          email,
          myOrder.data.status,
          paymentApprovedDate.toString()
        );
        // console.log(createAirtableConfirmationRes);

          res.status(200).send("ok");
      }
    }
  } catch (e) {
    console.log(e);
  }
}

// envia mail al usuario
async function sendUserConfirmation(email, orderId) {
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

// crea registro en airtable
async function createAirtableConfirmation(
  ProductId,
  email,
  status,
  paymentApprovedDate
) {
  base("ventas").create(
    {
      ProductId: ProductId,
      Comprador: email,
      Status: status,
      Payment_approved: paymentApprovedDate,
    },
    function (err, record) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(record.getId());
      return record.getId();
    }
  );
}

// función auxiliar
async function getUserEmail(userId) {
  const user = new User(userId);
  await user.get();
  const email = user.data.email;
  return email;
}
