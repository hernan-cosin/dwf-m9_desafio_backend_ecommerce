import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { findOrCreateAuthAndSendCode } from "controllers/auth";
import * as yup from "yup"
import {validateMiddleware} from "lib/middlewares"

// esquema del body
let bodySchema = yup
  .object()
  .shape({
    email: yup.string().email().required(),
  })
  .noUnknown(true).strict()

// endpoint
async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const email = req.body.email.trim().toLowerCase();

  const findOrCreateResponse = await findOrCreateAuthAndSendCode(email);
  
  res.status(200).send(findOrCreateResponse);
}

const postHandlerWithValidation = validateMiddleware(bodySchema, postHandler)

export default methods({
  post: postHandlerWithValidation
});
