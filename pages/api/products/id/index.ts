import type { NextApiRequest, NextApiResponse } from "next";
import { getProductsId } from "models/product";
import methods from "micro-method-router";

// obtiene todos los objectIds del index db
export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const productsId = await getProductsId()
    
    res.status(200).send(productsId)
  },
});
