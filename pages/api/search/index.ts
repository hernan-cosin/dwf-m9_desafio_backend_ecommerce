import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getOffsetAndLimitFromReq } from "lib/requests";
import { foodIndex } from "lib/algolia";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const { limit, offset } = getOffsetAndLimitFromReq(req, 100, 100);
    const q = req.query.q;

    const results = await foodIndex.search(q as string, {
      offset: offset,
      length: limit,
    }) as any;

    const filteredStockResults = results.hits.filter((r)=>{return r.Stock > 0})    

    res.send({
      results: filteredStockResults,
      pagination: {
        offset: offset,
        limit: limit,
        total: filteredStockResults.length,
      },
    });
  },
});
