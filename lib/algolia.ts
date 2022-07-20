import algoliasearch from "algoliasearch";

const client = algoliasearch("XKXU80RKHF", "42fb4654971f1536a5b89310455385ee");
export const foodIndex = client.initIndex("food");
