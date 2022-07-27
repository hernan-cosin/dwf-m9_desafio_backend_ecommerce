import test from "ava";
import { generate, decode } from "./jwt";

test("jwt", (t) => {
  const arg = { userId: "true" };
  const encoded = generate(arg);

  const decoded = decode(encoded) as any;

  delete decoded.iat;
  t.deepEqual(arg, decoded);
});
