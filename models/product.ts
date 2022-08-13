import { foodIndex } from "lib/algolia";

// devuelve todos los objectsIds del index db
export async function getProductsId() {
  try {
    const res = await foodIndex
      .search("", {
        attributesToRetrieve: ["objectID"],
      })
      .then(({ hits }) => {
          const productsId = hits.map((p)=>{return p.objectID})
        return productsId
      });
      return res
  } catch (e) {
    console.log(e);
  }
}
