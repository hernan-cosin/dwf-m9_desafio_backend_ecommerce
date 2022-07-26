import { base } from "lib/airtable";
import { ventasIndex } from "lib/algolia";
import { updateAlgoliaVentasIndex } from "lib/fetchs/sync-ventas";

export async function FindAlgoliaVentaObject(merchantOrder) {
  const algoliaVentaRecord = await ventasIndex.search(merchantOrder as string)
  return  algoliaVentaRecord
}

export async function createAirtableConfirmationAndUpdateAlgolia(
  ProductId,
  MerchantOrderId,
  email,
  status,
  paymentApprovedDate,
  orderId
) {
  try {
      // crea el registro en airtable
      base("ventas").create(
        {
          ProductId: ProductId,
          MerchantOrderId: MerchantOrderId,
          Comprador: email,
          Status: status,
          Payment_approved_date: paymentApprovedDate,
          OrderId: orderId
        },
        async function (err, record) {
          if (err) {
            console.error(err);
            return;
          }
          // actualiza algolia con el registro creado en airtable
          const updateAlgoliaVentasIndexRes = await updateAlgoliaVentasIndex()
          return record.getId();
        }
      )
  }catch (e) {
    console.log(e);
    
  }
}
