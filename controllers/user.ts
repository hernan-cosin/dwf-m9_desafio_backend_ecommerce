import { User } from "models/user";

type Address = {
  street: string;
  streetNumber: number;
  number: string;
};

export async function getUserData(token) {
  const user = new User(token.userId);

  await user.get();

  return user.data;
}

export async function updateUserData(token, updateData) {
  const user = new User(token.userId);
  await user.get();

  // si el usuario provee fecha de nacimiento
  if (updateData.birthday) {
    console.log(updateData.birthday);
    
    const birthdayFromUpdateData = new Date (updateData.birthday.year, updateData.birthday.month -1, updateData.birthday.day, 0, 0)
    console.log(birthdayFromUpdateData);
    
    updateData.birthday = birthdayFromUpdateData;
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
