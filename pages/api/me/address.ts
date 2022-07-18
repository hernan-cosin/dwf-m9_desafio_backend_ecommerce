import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import methods from "micro-method-router";
import * as yup from "yup";
import { updateUserAddress } from "controllers/user";

// esquema del body
let bodySchema = yup
  .object()
  .shape({
    street: yup.string().required(),
    streetNumber: yup.number().required().positive().integer(),
    number: yup.string(),
  })
  .noUnknown(true).strict()

//   middleware del esquema
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
async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
    const { street } = req.body;
    const { streetNumber } = req.body;
    const number = req.body.number || "";
  
    const updatedUserDataResponse = await updateUserAddress(token, {
      street,
      streetNumber,
      number,
    });
    if (updatedUserDataResponse) {
      res.status(200).send({ updated: updatedUserDataResponse });
    } else {
      res.status(404).send({ updated: updatedUserDataResponse });
    }
}

const patchHandlerWithValidation = schemaMiddelware(bodySchema, patchHandler);

const handler = methods({
  patch: patchHandlerWithValidation,
});

export default authMiddleware(handler);
