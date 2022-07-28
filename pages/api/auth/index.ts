import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { findOrCreateAuthAndSendCode } from "controllers/auth";
import * as yup from "yup"

// esquema del body
let bodySchema = yup
  .object()
  .shape({
    email: yup.string().email().required(),
  })
  .noUnknown(true).strict()

// middleware del esquema
function schemaMiddelware(schema, handler) {
  return async function (req, res, token) {
    try {
      await schema.validate(req.body);
      
      handler(req, res, token);
    } catch (e) {
      res.status(400).send({ message: e });
    }
  };
}

// endpoint
async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const email = req.body.email.trim().toLowerCase();

  const findOrCreateResponse = await findOrCreateAuthAndSendCode(email);

  res.send(findOrCreateResponse);
}

const postHandlerWithValidation = schemaMiddelware(bodySchema, postHandler)

export default methods({
  post: postHandlerWithValidation
});
