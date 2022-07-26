import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getOrderByOrderId } from "controllers/order";
import { authMiddleware } from "lib/middlewares";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { orderId } = req.query;
  const orderByOrderId = await getOrderByOrderId(orderId);

  if (orderByOrderId.length == 0) {
    res.status(404).send({ message: "producto no encontrado" });
  } else {
    res.status(200).send(orderByOrderId);
  }
}

const handler = methods({
  get: getHandler,
});

export default authMiddleware(handler);
