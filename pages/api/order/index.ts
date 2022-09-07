import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { createOrder } from "controllers/order";
import { authMiddleware } from "lib/middlewares";
import { createPreference } from "lib/mercadopago";

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
  try {
    const { productId } = req.query;
  
    const newOrder = await createOrder(token.userId, productId, req.body);
    // console.log("newOrder",newOrder)  
    const preference = await createPreference(productId, newOrder.newOrderId, req.body,)
    // console.log("preference",preference)    
    res.send({url: preference.init_point, orderId:newOrder.newOrderId});
  } catch (e) {
    console.log(e);
    
  }
}

const handler = methods({
  post: postHandler,
});

export default authMiddleware(handler);
