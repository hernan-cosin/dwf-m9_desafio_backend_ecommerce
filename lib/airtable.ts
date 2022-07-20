import Airtable from "airtable";

export const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  "appAdzT227f9fS2oq"
);
