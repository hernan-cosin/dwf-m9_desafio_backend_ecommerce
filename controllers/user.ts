import { User } from "models/user";
import { useTransition } from "react";

type Address = {
  street:string,
  streetNumber:number, 
  number:string
}

export async function getUserData(token) {
  const user = new User(token.userId);

  await user.get();
  if (user.data.birthday) {
    user.data.birthday = user.data.birthday.toDate()
  }
  // console.log(user.data);

  return user.data;
}

export async function updateUserData(token, updateData) {
  const user = new User(token.userId);
  await user.get();

  if (user.data.birthday) {
    const convertedDate = new Date(user.data.birthday)
    updateData.birthday = convertedDate    
  }

  user.data = {
    ...updateData,
  };

  try {
    await user.update();
    return true;
  } catch (e) {
    return e;
  }
}

export async function updateUserAddress(token, address: Address) {
  const user = new User(token.userId);
  await user.get();

  user.data.address = address;

  try {
    await user.update();
    return true;
  } catch (e) {
    throw e;
  }
}
