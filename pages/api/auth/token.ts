import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup"
import { verifyEmailAndCode } from "controllers/auth";

// esquema del body
let bodySchema = yup
  .object()
  .shape({
    email: yup.string().email().required(),
    code: yup.number().max(99999).min(10000).required().positive().integer(),
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

const postHandlerWithValidation = schemaMiddelware(bodySchema, postHandler)

export default methods({
  post: postHandlerWithValidation
})

