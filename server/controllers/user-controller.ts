import { User, Pet, Auth, Report } from "../models/index";

type profileData = {
  email: string;
};

type dbResponse = {
  user: User;
  created: boolean;
};

export async function createProfile(
  profileData: profileData
): Promise<dbResponse> {
  try {
    const { email } = profileData;
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { email },
      include: [Pet, Auth, Report],
    });
    return { user, created };
  } catch (error) {
    console.log(error.message, "create profile");
  }
}

export async function getUser(email: string): Promise<User> {
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      return user;
    } else return null;
  } catch (error) {
    console.log(error.message, "get user");
  }
}
