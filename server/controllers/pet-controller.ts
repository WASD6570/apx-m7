import { User, Pet } from "../models/index";
import { cloudinary } from "../lib/cloudinary";

type petData = {
  pictureURI: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
};

export async function createPet(
  userId: number,
  petData: petData
): Promise<Pet> {
  try {
    const { pictureURI, name, description, lat, lng } = petData;
    const user = await User.findByPk(userId);

    const pictureURL = await cloudinary.uploader.upload(
      pictureURI,
      async (err, result) => {
        if (err) {
          throw err;
        }
        return result.secure_url;
      }
    );

    if (user == null) {
      throw Error("user does not exists");
    } else {
      const [pet, created] = await Pet.findOrCreate({
        where: { name, userId: user.get("id") },
        defaults: {
          name,
          pictureURL,
          description,
          userId: user.get("id"),
          lat,
          lng,
        },
      });

      return pet;
    }
  } catch (error) {
    console.log(error);
  }
}
