import mercadopago from "mercadopago";

let API_BASE_URL;
process.env.NODE_ENV == "development"
  ? (API_BASE_URL = "http://localhost:3000")
  : (API_BASE_URL = "https://dwf-m9-desafio-backend-ecommerce.vercel.app");

mercadopago.configure({
  access_token: process.env.MP_TOKEN,
});

export async function getMerchantOrder(id) {
  const res = await mercadopago.merchant_orders.get(id);
  return res.body;
}

export async function createPreference(productId, orderId, additionalInfo) {
  console.log("url", API_BASE_URL);

  try {
    const getProductInformationRes = await fetch(
      API_BASE_URL + "/api/products/" + productId,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const productInformation = await getProductInformationRes.json();

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
        succes: "https://apx.school",
      },
      notification_url:
        "https://webhook.site/6cb23cdc-7673-433b-8b11-a58dd222522d",
    };

    const res = await mercadopago.preferences.create(data);
    return res.body;
  } catch (e) {
    console.log(e);
  }
}
