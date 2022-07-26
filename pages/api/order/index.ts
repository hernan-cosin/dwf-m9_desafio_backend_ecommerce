import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { createOrder } from "controllers/order";
import { authMiddleware } from "lib/middlewares";
import { createPreference } from "lib/mercadopago";

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const { productId } = req.query;

  const newOrder = await createOrder(token.userId, productId, req.body);

  const preference = await createPreference(productId, newOrder.newOrderId, req.body,)
  
  res.send({url: preference.init_point, orderId:newOrder.newOrderId});
}

// async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
//   // const { orderId } = req.query;
//   // res.send(orderId)
// }

const handler = methods({
  post: postHandler,
  // get: getHandler
});

export default authMiddleware(handler);
