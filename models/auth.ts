import { firestore } from "lib/firestore";

const collection = firestore.collection("auth");

export class Auth {
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

  static async findByEmail(email: string) {
    const cleanEmail = email;

    const results = await collection.where("email", "==", cleanEmail).get();

    if (results.docs.length) {
      const first = results.docs[0];

      const newAuth = new Auth(first.id);
      newAuth.data = first.data();

      return newAuth;
    } else {
      return null;
    }
  }

  static async createNewAuth(data) {
    const newAuthSnap = await collection.add(data);
    const newAuth = new Auth(newAuthSnap.id);
    newAuth.data = data;

    return newAuth;
  }
}
