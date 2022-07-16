import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import methods from "micro-method-router"
import { updateUserAddress } from "controllers/user";

const handler = methods({
    patch: patchHandler
});

export async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
    const {address} = req.body

    const updatedUserDataResponse = await updateUserAddress(token, address)
    if (updatedUserDataResponse) {
        res.status(200).send({updated:updatedUserDataResponse})
    } else {
        res.status(404).send({updated:updatedUserDataResponse})
    }
}

export default authMiddleware(handler);
