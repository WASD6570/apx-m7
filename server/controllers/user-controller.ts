import { User } from "../models/index";
import { cloudinary } from "../lib/cloudinary";

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

async function getImageHostURL(URI: string): Promise<string> {
  try {
    let secureUrl: string;
    await cloudinary.uploader.upload(URI, function (err, result) {
      if (err) {
        throw err;
      }
      return (secureUrl = result.secure_url);
    });

    return secureUrl;
  } catch (error) {
    console.log(error.message);
  }
}
