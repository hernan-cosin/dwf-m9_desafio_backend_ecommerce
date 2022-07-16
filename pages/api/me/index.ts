import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import methods from "micro-method-router"
import { getUserData, updateUserData } from "controllers/user";

const handler = methods({
    get: getHandler,
    patch: patchHandler
  });

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
    const userData = await getUserData(token)

    res.status(200).send(userData);
}

export async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
    const updateData = req.body

    const updatedUserDataResponse = await updateUserData(token, updateData)
    if (updatedUserDataResponse) {
        res.status(200).send({updated:updatedUserDataResponse})
    } else {
        res.status(404).send({updated:updatedUserDataResponse})
    }
}

export default authMiddleware(handler);
