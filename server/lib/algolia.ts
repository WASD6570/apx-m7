import algoliasearch from "algoliasearch";

const client = algoliasearch("WVYQW4ELOG", "d20db299e415c1fd01ef4fadb3b0f7cc");
export const index = client.initIndex("pets_LOCATIONS");
