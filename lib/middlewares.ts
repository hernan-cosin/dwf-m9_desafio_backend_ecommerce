import { decode } from "lib/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import parseToken from "parse-bearer-token";
import * as yup from "yup";

export function validateMiddleware(schema, handler) {
  return async (req: NextApiRequest, res: NextApiResponse, token?: string) => {
    if (["PATCH", "POST"].includes(req.method)) {
      try {
        await schema.validate(req.body, {abortEarly: false});
        await handler(req, res, token ? token : "");
      } catch (e) {
        res.status(400).send(e)
      }
    }
  };
}

export function authMiddleware(callback) {
  return function (req, res) {
    const token =
      process.env.TESTING == "true"
        ? req.headers.authorization.split(" ")[1]
        : parseToken(req);

    if (!token) {
      return res.status(401).send({ message: "token not found" });
    }

    const decodedToken = decode(token);

    if (decodedToken) {
      callback(req, res, decodedToken);
      res.status(200);
    } else {
      res.status(401).send({ message: "unauthorized" });
    }
  };
}
