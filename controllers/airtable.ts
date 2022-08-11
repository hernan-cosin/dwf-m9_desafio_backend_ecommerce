import { generateNewSell } from "models/ventas";

interface DataSell {
  ProductId: string,
  MerchantOrderId: string,
  email: string,
  status: string,
  paymentApprovedDate: string,
  orderI: string
}

export async function createSellConfirmationAndUpdateIndexDb(data: DataSell) {
  try {
    const response = await generateNewSell(data)
  
    return response
  }catch (e) {
    console.log(e);
    throw "error"
  }
}
