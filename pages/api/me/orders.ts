import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import methods from "micro-method-router";
import { getMyOrders } from "controllers/order";

const handler = methods({
    get: getHandler,
});

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
    const response = await getMyOrders(token.userId)
    
    res.status(200).send(response)
}

export default authMiddleware(handler);
