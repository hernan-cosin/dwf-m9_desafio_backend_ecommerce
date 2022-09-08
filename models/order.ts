import { firestore } from "lib/firestore";

const collection = firestore.collection("order");
export class Order {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;

  constructor(id) {
    this.ref = collection.doc(id);
    this.id = id;
  }

  async get() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }

  async update() {
    this.ref.update(this.data);
  }

  static async createNewOrder(data) {
    // const newOrderSnap = await collection.doc(id)
    const newOrderSnap = await collection.add(data);
    const newOrder = new Order(newOrderSnap.id);
    newOrder.data = data;

    return newOrder;
  }

  
  static async getOrdersByUserId(userId) {
    const ordersByIdSnap = await collection.where("userId", "==", userId).get();

    if (ordersByIdSnap.docs.length) {
      const results = ordersByIdSnap.docs;

      let myOrders = []

      for (const doc of results) {
        myOrders.push(
          {
            orderId: doc.id,
            status: doc.data().status,
            aditionalInfo: doc.data().additionalInfo,
            createdAt: doc.data().createdAt.toDate().toLocaleDateString('es-AR', {
              timeZone:	"America/Argentina/Buenos_Aires",
            }) + " " + doc.data().createdAt.toDate().toLocaleTimeString('es-AR', {
              timeZone:	"America/Argentina/Buenos_Aires",
            })
          }
        ) 
      }

      return myOrders
    } else {
      return null;
    }
  }

  static async getOrdersByOrderId(orderId){
    const order = await collection.doc(orderId).get()
    
    if (order.exists == false) {
      return []
    }
    else {
      return order.data()
    }

  }
}
