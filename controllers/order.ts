import {Order} from "models/order"

export async function createOrder(userId, productId, additionalInfo) {
    const newOrder = await Order.createNewOrder({
            userId: userId,
            productId,
            additionalInfo: additionalInfo,
            status: "pending",
            createdAt: new Date()
    });    

    return {newOrderId:newOrder.id, newOrderData: newOrder.data}
}