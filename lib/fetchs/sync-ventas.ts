
let API_BASE_URL;
process.env.NODE_ENV == "development"
  ? (API_BASE_URL = "http://localhost:3000")
  : (API_BASE_URL = "https://dwf-m9-desafio-backend-ecommerce.vercel.app");

export async function updateAlgoliaVentasIndex() {
const res = await fetch(API_BASE_URL + "/api/sync/ventas", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
});
const updateAlgoliaVentasIndexRes = await res.json();
return updateAlgoliaVentasIndexRes;
}