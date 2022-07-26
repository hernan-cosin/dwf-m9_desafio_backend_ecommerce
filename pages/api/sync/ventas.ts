import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import {base} from "lib/airtable"
import { ventasIndex } from "lib/algolia";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    base("ventas")
      .select({
        pageSize: 5,
        view: "Grid view",
      })
      .eachPage(
        async function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.
          const objects = records.map((r) => {
            // console.log(r);

            return {
              objectID: r.id,
              ...r.fields,
            };
          });

          await ventasIndex.saveObjects(objects);
          // console.log("objects", objects);

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(err) {
          res.send({message:"done"});
          if (err) {
            console.error(err);
            return;
          }
        })
      }
    })