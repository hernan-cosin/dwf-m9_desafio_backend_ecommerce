import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { base } from "lib/airtable";
import { foodIndex } from "lib/algolia";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    try{    
      base("milanesas")
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

          await foodIndex.saveObjects(objects);
          // console.log("objects", objects);

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(err) {
          res.send("done");
          if (err) {
            console.error(err);
            return;
          }
        }
      );
    base("hamburguesas")
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

          await foodIndex.saveObjects(objects);
          // console.log("objects", objects);

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(err) {
          res.send("done");
          if (err) {
            console.error(err);
            return;
          }
        }
      );
  } catch(e) {
    console.log(e);
    
  }

  },
});
