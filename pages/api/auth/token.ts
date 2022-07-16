import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { verifyEmailAndCode } from "controllers/auth";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    const email = req.body.email.trim().toLocaleLowerCase();
    const code = req.body.code;

    const verifyResponse = await verifyEmailAndCode(email, code);
    
    if (verifyResponse.token) {
        res.status(200).send({token: verifyResponse.token})
    } if (verifyResponse.error) {
        res.status(400).send(verifyResponse.error)
    } if ( verifyResponse.codeExpired) {
        res.status(401).send({codeExpired: verifyResponse.codeExpired})
    }
  },
});
