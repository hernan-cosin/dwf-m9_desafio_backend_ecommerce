import { base } from "lib/airtable";
import { ventasIndex } from "lib/algolia";
import { updateAlgoliaVentasIndex } from "lib/fetchs/sync-ventas";

export async function FindVentaObject(merchantOrder) {
  const algoliaVentaRecord = await ventasIndex.search(merchantOrder as string);
  return algoliaVentaRecord;
}

export async function generateNewSell(data) {
  try {
    base("ventas").create(
    {
      ProductId: data.ProductId,
      MerchantOrderId: data.MerchantOrderId,
      Comprador: data.email,
      Status: data.status,
      Payment_approved_date: data.paymentApprovedDate,
      OrderId: data.orderId,
    },
    async function (err, record) {
      if (err) {
        console.error(err);
        return;
      }
      // actualiza algolia con el registro creado en airtable
      const updateAlgoliaVentasIndexRes = await updateAlgoliaVentasIndex();      
      return record.getId();
    })
    return {message: "created"}
  } catch(e) {
    console.log(e);
    throw "error en models ventas"
  }
}
