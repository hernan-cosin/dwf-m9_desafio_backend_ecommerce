import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { findOrCreateAuthAndSendCode } from "controllers/auth";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    const email = req.body.email.trim().toLowerCase();

    const findOrCreateResponse = await findOrCreateAuthAndSendCode(email);

    res.send(findOrCreateResponse);
  },
});
