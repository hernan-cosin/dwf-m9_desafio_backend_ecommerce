import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getOffsetAndLimitFromReq } from "lib/requests";
import { foodIndex } from "lib/algolia";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    // const { limit, offset } = getOffsetAndLimitFromReq(req, 100, 100);
    // const limit = req.query.limit 
    const limit = req.query.hitsPerPage
    const page = req.query.page 
    const q = req.query.q;
console.log(req.query);
console.log(q);


    const results = (await foodIndex.search(q as string, {
      page: page ? parseInt(page as string) : 0,
      hitsPerPage: page ? parseInt(limit as string) : 5,
      // offset: offset,
      // length: limit,
    })) as any;    
    // console.log("PAGINATION",results)

    const filteredStockResults = results.hits.filter((r) => {
      return r.Stock > 0;
    });

    res.send({
      results: filteredStockResults,
      pagination: {
        // offset: offset,
        // limit: limit,
        inPage: filteredStockResults.length,
        total: results.nbHits,
        hitsPerPage: results.hitsPerPage,
        nbPages: results.nbPages,
        page: results.page,
      },
    });
  },
});
