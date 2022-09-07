import mercadopago from "mercadopago";
import { getProductInformation } from "lib/fetchs/product";

mercadopago.configure({
  access_token: process.env.MP_TOKEN,
});

export async function getMerchantOrder(id) {
  const res = await mercadopago.merchant_orders.get(id);
  return res.body;
}

export async function createPreference(productId, orderId, additionalInfo) {
  try {
    const parsedAdditionalInfo = JSON.parse(additionalInfo)
    // console.log(parsedAdditionalInfo)
    // console.log(typeof parsedAdditionalInfo.amount)
    // console.log(typeof parseInt(parsedAdditionalInfo.amount))
    const productInformation = await getProductInformation(productId);
    const data = {
      external_reference: orderId,
      items: [
        {
          title: productInformation.Title,
          description: productInformation.Description,
          picture_url: productInformation.Attachments[0].url,
          category_id: productInformation.Category,
          quantity: parseInt(parsedAdditionalInfo.amount),
          currency_id: "ARS",
          unit_price: productInformation.Price,
        },
      ],
      back_urls: {
        success: "https://m10-desafio.vercel.app/thanks",
      },
      auto_return: "all",
      notification_url:
        // "https://webhook.site/6cb23cdc-7673-433b-8b11-a58dd222522d",
        "https://dwf-m9-desafio-backend-ecommerce.vercel.app/api/ipn/mercadopago",
    };
  
    const res = await mercadopago.preferences.create(data);
    return res.body;
  } catch (e) {
    console.log(e);
    
  }
  
}
