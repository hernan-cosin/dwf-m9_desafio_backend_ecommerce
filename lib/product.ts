
let API_BASE_URL;
process.env.NODE_ENV == "development"
  ? (API_BASE_URL = "http://localhost:3000")
  : (API_BASE_URL = "https://dwf-m9-desafio-backend-ecommerce.vercel.app");
  
export async function getProductInformation(productId) {
    const res = await fetch(API_BASE_URL + "/api/products/" + productId, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const productInformation = await res.json();
    return productInformation;
  }
  