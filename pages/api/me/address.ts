import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, validateMiddleware } from "lib/middlewares";
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

const patchHandlerWithValidation = validateMiddleware(bodySchema, patchHandler);

const handler = methods({
  patch: patchHandlerWithValidation,
});

export default authMiddleware(handler);
