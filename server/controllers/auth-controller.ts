import { Auth, User } from "../models/index";

type authData = {
  email: string;
  password: string;
};

type authDbRes = {
  auth: Auth;
  created: boolean;
};

export async function authUser(
  userId: number,
  authData: authData
): Promise<Auth> {
  try {
    const { email, password } = authData;
    const auth = await Auth.findOne({
      where: { email, userId, password },
    });
    return auth;
  } catch (error) {
    console.log(error.message, "auth user");
  }
}
export async function createAuthUser(
  userId: number,
  authData: authData
): Promise<authDbRes> {
  try {
    const { email, password } = authData;
    const [auth, created] = await Auth.findOrCreate({
      where: { email, userId },
      defaults: { email, password, userId },
      include: [User],
    });
    return { auth, created };
  } catch (error) {
    console.log(error.message, "auth user");
  }
}
