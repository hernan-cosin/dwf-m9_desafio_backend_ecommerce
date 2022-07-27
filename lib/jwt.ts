import jwt from "jsonwebtoken";

export function generate(obj): string {
  const token = jwt.sign(
    { userId: obj.userId },
    process.env.JWT_SECRET as string
  );

  return token ;
}

export function decode(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded;

}
