import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { User } from "models/user";

async function handler(req: NextApiRequest, res: NextApiResponse, token) {
    const user = new User(token.userId);
//   console.log("token", token);

    await user.get();

    res.send(user.data);
}

export default authMiddleware(handler);
