import type { NextApiRequest, NextApiResponse } from "next";
import { getMerchantOrder } from "lib/mercadopago";
import { User } from "models/user";
import { getProductInformation } from "lib/fetchs/product";
import { updateOrderStatus } from "controllers/order";
import { sendUserConfirmation } from "lib/sendgrid";
import {
  createSellConfirmationAndUpdateIndexDb,
} from "controllers/airtable";
import { FindVentaObject } from "models/ventas";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, topic } = req.query;

    if (topic == "merchant_order") {
      // verifica que no haya un registro en algolia con el id de merchant order
      // para evitar que se generen dos registros en airtable
      // por que mercadopago envía dos notificaciones con el merchant order id
      const algoliaVentaRecord = await FindVentaObject(id);

      if (algoliaVentaRecord.hits.length == 0) {
        const order = await getMerchantOrder(id);

        if (order.status == "closed") {
          const orderId = order.external_reference;

          const myOrder = await updateOrderStatus(orderId);

          // envia la confirmación de compra por mail al usuario
          const userId = myOrder.data.userId;
          const email = await getUserEmail(userId);
          const sendUserConfirmationRes = await sendUserConfirmation(email, orderId);

          // obtiene información para crear registro en airtable para el vendedor
          const productId = myOrder.data.productId;
          const productInformation = await getProductInformation(productId);
          const merchantOrderApprovedDate = new Date(
            order.payments[0].date_approved
          );

          // formateando la fecha
          const paymentApprovedDate =
            merchantOrderApprovedDate.toDateString() +
            " " +
            merchantOrderApprovedDate.toLocaleTimeString("es-AR", {
              timeZone: "America/Argentina/Buenos_Aires",
            });

          // crea el registro en airtable y actualiza algolia
          const ventaResponse = await createSellConfirmationAndUpdateIndexDb({
            ProductId: productInformation.id,
            MerchantOrderId: order.id.toString(),
            email: email,
            status: myOrder.data.status,
            paymentApprovedDate: paymentApprovedDate,
            orderI: orderId
          });
          
          if( ventaResponse.message == "created"){
            res.status(200).send("ok");
          }
        } else {
        }
      }
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
