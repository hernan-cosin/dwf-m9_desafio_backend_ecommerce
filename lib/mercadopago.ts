import mercadopago from "mercadopago";
import {getProductInformation} from "lib/product"

mercadopago.configure({
  access_token: process.env.MP_TOKEN,
});

export async function getMerchantOrder(id) {
  const res = await mercadopago.merchant_orders.get(id);
  return res.body;
}

export async function createPreference(productId, orderId, additionalInfo) {
  const productInformation = await getProductInformation(productId);

  const data = {
    external_reference: orderId,
    items: [
      {
        title: productInformation.Title,
        description: productInformation.Description,
        picture_url: productInformation.Attachments[0].url,
        category_id: productInformation.Category,
        quantity: additionalInfo.amount,
        currency_id: "ARS",
        unit_price: productInformation.Price,
      },
    ],
    back_urls: {
      succes: "https://google.com.ar",
    },
    notification_url:
      "https://webhook.site/6cb23cdc-7673-433b-8b11-a58dd222522d",
      // "https://dwf-m9-desafio-backend-ecommerce.vercel.app/api/ipn/mercadopago",
  };

  const res = await mercadopago.preferences.create(data);
  return res.body;
}
