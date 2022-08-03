import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup"
import { verifyEmailAndCode } from "controllers/auth";
import { validateMiddleware } from "lib/middlewares";

// esquema del body
let bodySchema = yup
  .object()
  .shape({
    email: yup.string().email().required(),
    code: yup.number().required().max(99999).min(10000).positive().integer(),
  })
  .noUnknown(true).strict()

// endpoint
async function postHandler(req: NextApiRequest, res: NextApiResponse) {    
  const email = req.body.email.trim().toLocaleLowerCase();
  const code = req.body.code;
  
  const verifyResponse = await verifyEmailAndCode(email, code);
  
  if (verifyResponse.token) {
    res.status(200).send({token: verifyResponse.token})
  } if (verifyResponse.error) {
    res.status(400).send(verifyResponse.error)
  } if (verifyResponse.codeExpired) {
    res.status(401).send({codeExpired: verifyResponse.codeExpired})
  }
}

const postHandlerWithValidation = validateMiddleware(bodySchema, postHandler)

export default methods({
  post: postHandlerWithValidation
})

