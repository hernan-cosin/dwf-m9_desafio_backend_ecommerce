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

export async function updateOrderStatus(orderId) :Promise<Order>{
    const myOrder = new Order(orderId);
    await myOrder.get();
    myOrder.data.status = "closed";
    await myOrder.update();
    
    return myOrder 
}

export async function getMyOrders(userId) {
    const orders = await Order.getOrdersByUserId(userId)

    if (orders.length > 0) {
        return orders
    } else {
        return []
    }
}

export async function getOrderByOrderId(orderId) {
    const order = await Order.getOrdersByOrderId(orderId)
    
    if (order.length == 0) {
      return []
    } else {
        const date = order.createdAt.toDate()
    
        order.createdAt = date.toDateString() + " " + date.toLocaleTimeString('es-AR', {
            timeZone:	"America/Argentina/Buenos_Aires",
          });
        delete order?.userId
            
        return order
    }
}