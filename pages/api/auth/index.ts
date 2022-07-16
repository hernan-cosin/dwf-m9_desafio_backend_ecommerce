import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { findOrCreateAuthAndSendCode, sendEmail } from "controllers/auth";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    const email = req.body.email.trim().toLocaleLowerCase();

    const findOrCreateResponse = await findOrCreateAuthAndSendCode(email);

    res.send(findOrCreateResponse);
  },
});
