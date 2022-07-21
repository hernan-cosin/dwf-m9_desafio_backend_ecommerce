import type { NextApiRequest, NextApiResponse } from "next";
import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "models/order";

export default async function(req:NextApiRequest, res: NextApiResponse) {
    const {id, topic} = req.query

    if (topic == "merchant_order") {
        const order = await getMerchantOrder(id)        

        if (order.status == "closed") {
            const orderId = order.external_reference
            const myOrder = new Order(orderId)
            await myOrder.get()
            myOrder.data.status = "closed"
            await myOrder.update()
            
        }

        
    }
    res.send("ok")
}