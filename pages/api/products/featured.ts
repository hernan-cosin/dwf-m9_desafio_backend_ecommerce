import type { NextApiRequest, NextApiResponse } from "next";
import { foodIndex } from "lib/algolia";
import methods from "micro-method-router";
import {getProductsFeatured} from "models/product"

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    // const { productId } = req.query;
    
    try{
      const getFeaturedProducts = await getProductsFeatured()
      let filteredProducts = getFeaturedProducts.filter((p)=> {return p["Featured"] == "true"})
      res.status(200).send(filteredProducts)
    } catch(e) {
      console.log(e);  
    }
  },
});
