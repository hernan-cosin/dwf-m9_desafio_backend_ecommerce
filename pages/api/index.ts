import type { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "lib/firestore";
import { Auth } from "models/auth";
import { findOrCreateAuth, sendCode } from "controllers/auth";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const auth = await sendCode(req.body.email);
  res.send(auth);
}
