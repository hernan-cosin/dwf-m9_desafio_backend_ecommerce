import { User } from "models/user";

export async function getUserData(token) {
  const user = new User(token.userId);

  await user.get();

  return user.data;
}

export async function updateUserData(token, updateData) {
  const user = new User(token.userId);
  await user.get();

  user.data = {
    ...updateData
  }

  try {
    await user.update()
    return true
  } catch(e) {
    return e
  }
}

export async function updateUserAddress(token, address) {
  const user = new User(token.userId)
  await user.get()

  user.data.address = address;

  try {
    await user.update()
    return true
  } catch(e) {
    return e
  }
}
