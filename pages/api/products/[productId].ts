import type { NextApiRequest, NextApiResponse } from "next";
import { foodIndex } from "lib/algolia";
import methods from "micro-method-router";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const { productId } = req.query;

    const getproductById = await foodIndex.getObject(productId as string)
    res.status(200).send(getproductById)
  },
});
