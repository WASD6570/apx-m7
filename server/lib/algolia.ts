import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.ALGOLIA_API_ID,
  process.env.ALGOLIA_API_KEY
);
export const index = client.initIndex("pets_LOCATIONS");
