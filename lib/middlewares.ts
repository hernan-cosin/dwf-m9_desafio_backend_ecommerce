import type { NextApiRequest, NextApiResponse } from "next";
import parseToken from "parse-bearer-token";
import { decode } from "lib/jwt";

export function authMiddleware(callback) {
  return function (req, res) {
    const token = process.env.TESTING == "true"? req.headers.authorization.split(" ")[1] : parseToken(req);
    
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
