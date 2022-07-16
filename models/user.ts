import { firestore } from "lib/firestore"

const collection = firestore.collection("user")
export class User {
    ref: FirebaseFirestore.DocumentReference
    data: any
    id: string

    constructor(id) {
        this.ref = collection.doc(id)
        this.id = id
    }

    async get() {
        const snap = await this.ref.get()
        this.data = snap.data()
        return this.data
    }

    async update() {
        this.ref.update(this.data);
    }

    static async createNewUser(data) {
        const newUserSnap = await collection.add(data)
        const newUser = new User(newUserSnap.id)
        newUser.data = data

        return newUser
    }
}