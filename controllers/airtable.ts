import { base } from "lib/airtable";

export async function findOrCreateAirtableConfirmation(
  ProductId,
  MerchantOrderId,
  email,
  status,
  paymentApprovedDate
) {
  base("ventas").create(
    {
      ProductId: ProductId,
      MerchantOrderId: MerchantOrderId,
      Comprador: email,
      Status: status,
      Payment_approved_date: paymentApprovedDate,
    },
    function (err, record) {
      if (err) {
        console.error(err);
        return;
      }
      return record.getId();
    }
  );
}
