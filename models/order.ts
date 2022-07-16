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
    // return this.data;
  }

  async update() {
    this.ref.update(this.data);
  }

  static async createNewOrder(data) {
    // const newOrderSnap = await collection.doc(id)
    const newOrderSnap = await collection.add(data)
    const newOrder = new Order(newOrderSnap.id)
    newOrder.data = data

    return newOrder
  }
}
