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

export async function updateOrderStatus(orderId){
    const myOrder = new Order(orderId);
    await myOrder.get();
    myOrder.data.status = "closed";
    await myOrder.update();
    
    return myOrder 
}