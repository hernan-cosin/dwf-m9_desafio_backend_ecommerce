import type { NextApiRequest, NextApiResponse } from "next";
import { getMerchantOrder } from "lib/mercadopago";
import { User } from "models/user";
import { getProductInformation } from "lib/product";
import { updateOrderStatus } from "controllers/order";
import {sendUserConfirmation} from "controllers/sendgrid"
import {findOrCreateAirtableConfirmation} from "controllers/airtable"

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, topic } = req.query;

    if (topic == "merchant_order") {
      const order = await getMerchantOrder(id);

      if (order.status == "closed") {
        const orderId = order.external_reference;

        const myOrder = await updateOrderStatus(orderId);

        // envia la confirmación de compra por mail al usuario
        const userId = myOrder.data.userId;
        const email = await getUserEmail(userId);
        // const sendUserConfirmationRes = await sendUserConfirmation(email, orderId);

        // obtiene información para crear registro en airtable para el vendedor
        const productId = myOrder.data.productId;
        const productInformation = await getProductInformation(productId);
        const merchantOrderApprovedDate = new Date(
          order.payments[0].date_approved
        );
          console.log("MERCHANTORDERAPPROVEDDATE", merchantOrderApprovedDate);
          
          // formateando la fecha
          const paymentApprovedDate =
          merchantOrderApprovedDate.toDateString() +
          " " +
          merchantOrderApprovedDate.toLocaleTimeString("419");
          
          console.log("PARMENTAPPROVEDDATE", paymentApprovedDate);

        // crea el registro en airtable
        await findOrCreateAirtableConfirmation(
          productInformation.id,
          order.id,
          email,
          myOrder.data.status,
          paymentApprovedDate,
          orderId
        );
                  
      }
      res.status(200).send("ok");
    }
  } catch (e) {
    console.log(e);
  }
}

// función auxiliar
async function getUserEmail(userId) {
  const user = new User(userId);
  await user.get();
  const email = user.data.email;
  return email;
}
