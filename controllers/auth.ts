import { Auth } from "models/auth";
import { User } from "models/user";
import addMinutes from "date-fns/addMinutes";
import subMinutes from "date-fns/subMinutes";
import { sgMail } from "lib/sendgrid";
import { generate } from "lib/jwt";

type findOrCreateAuthAndSendCodeResponse = {
  authFound: boolean;
  authCreated: boolean;
  sendCodeToFirebase: boolean;
};

type verifyEmailAndCodeResponse = {
  error: string;
  token: string;
  codeExpired: boolean;
};

// recibe un email
// busca un auth con ese email y le envia un código y la fecha de expiracion
// si no encuentra un auth, crea un user y luego un auth con el userId
// el código y la fecha de expiración
export async function findOrCreateAuthAndSendCode(
  email: string
): Promise<findOrCreateAuthAndSendCodeResponse> {
  const cleanEmail = email.trim().toLowerCase();

  const auth = await Auth.findByEmail(cleanEmail);

  if (auth) {
    const sendCodeRes = await sendCodeToFirebase(auth);
    const code = sendCodeRes.code;
    await sendEmail(cleanEmail, code);
    return {
      authFound: true,
      authCreated: false,
      sendCodeToFirebase: sendCodeRes.sendCode,
    };
  } else {
    const newUser = await User.createNewUser({
      email: cleanEmail,
    });

    const newAuth = await Auth.createNewAuth({
      email: cleanEmail,
      userId: newUser.id,
      code: "",
      expires: new Date(),
    });

    const sendCodeRes = await sendCodeToFirebase(newAuth);
    const code = sendCodeRes.code;
    await sendEmail(cleanEmail, code);

    return {
      authFound: false,
      authCreated: true,
      sendCodeToFirebase: sendCodeRes.sendCode,
    };
  }
}

// genera y envia el código a firebase auth collection
export async function sendCodeToFirebase(auth: Auth) {
  try {
    const code = getRandomInt(10000, 99999);
    auth.data.code = code;

    const now = new Date();
    const nowPlus10min = addMinutes(now, 10);

    auth.data.expires = nowPlus10min;
    await auth.update();

    return {
      sendCode: true,
      code: code,
    };
  } catch (e) {
    throw "No se ha enviado el código";
  }
}

// envia mail via sendGrid
export async function sendEmail(email: string, code: number) {
  const msg = {
    to: email,
    from: "hcosin@gmail.com", // Use the email address or domain you verified above
    subject: "Your access code",
    html:
      '<div style=""><h3 style="font-family: sans-serif;">Enter this code to acces: </h3><h1 style="font-family: san-serif;">' +
      code +
      "</h1></div></div>",
  };

  console.log(email, code);

  // const sendgridResponse = await sgMail.send(msg);
  // return sendgridResponse;
}

// verifica que el código y el email enviados por el usuario coincidan
// con el codigo y el email en el registro auth
export async function verifyEmailAndCode(
  userEmail: string,
  userCode: number
): Promise<verifyEmailAndCodeResponse> {
  const dbAuth = await Auth.findByEmail(userEmail);

  const dbEmail = dbAuth?.data.email;
  const dbCode = dbAuth?.data.code;
  const dbExpires = dbAuth?.data.expires;

  // si no encuentra email
  if (dbAuth == null) {
    return {
      error: "Email incorrecto",
      token: null,
      codeExpired: null,
    };
  }
  // si el código en la dbAuth no coincide con el código enviado
  if (dbCode !== userCode) {
    return { error: "Código incorrecto", token: null, codeExpired: null };
  }
  // el email y el código en la dbAuth coinciden con los enviados
  if (dbEmail == userEmail && dbCode == userCode) {
    const now = new Date();
    const dbExpirationDate = dbExpires.toDate();

    const expired = isExpired(now, dbExpirationDate);

    // código vencido
    if (expired) {
      return { error: null, token: null, codeExpired: true };
    }
    // código válido
    if (!expired) {
      const token = generate({ userId: dbAuth.data.userId });

      // invalidación del código en dbAuth
      const fechaAtrasada = subMinutes(dbAuth.data.expires.toDate(), 20);

      dbAuth.data.expires = fechaAtrasada
      await dbAuth.update();

      return {
        error: null,
        token: token,
        codeExpired: false,
      };
    }
  }
}

// funciones auxiliares

// genera un número random de 5 dígitos
function getRandomInt(min, max): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// verifica si el código expiró
function isExpired(date, expirationDate) {
  if (date > expirationDate) {
    return true;
  } else {
    return false;
  }
}
