import { generateNewSell } from "models/ventas";

export async function createAirtableConfirmationAndUpdateAlgolia(
  ProductId,
  MerchantOrderId,
  email,
  status,
  paymentApprovedDate,
  orderId
) {
  try {
    const response = await generateNewSell({ProductId,MerchantOrderId, email, status, paymentApprovedDate, orderId})
  
    return response
  }catch (e) {
    console.log(e);
    throw "error"
  }
}
