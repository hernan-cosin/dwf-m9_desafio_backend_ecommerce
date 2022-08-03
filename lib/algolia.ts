import algoliasearch from "algoliasearch";

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);

export const foodIndex = client.initIndex("food");
export const ventasIndex = client.initIndex("ventas");
