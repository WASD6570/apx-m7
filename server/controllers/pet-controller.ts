import { User, Pet } from "../models/index";
import { cloudinary } from "../lib/cloudinary";

type petData = {
  pictureURI: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  isLost: boolean;
};

async function createPet(userId: number, petData: petData): Promise<Pet> {
  try {
    const { pictureURI, name, description, lat, lng, isLost } = petData;
    const user = await User.findByPk(userId);

    if (user == null) {
      throw Error("user does not exists");
    } else {
      const pictureURL = await checkIfPictureExists(pictureURI);
      const [pet, created] = await Pet.findOrCreate({
        where: { name, userId: user.get("id") },
        defaults: {
          name,
          pictureURL,
          description,
          userId: user.get("id"),
          lat,
          lng,
          isLost,
        },
        include: [User],
      });

      return pet;
    }
  } catch (error) {
    console.log(error, "error en el pet-controler");
  }
}

async function getUserPets(userId: number): Promise<Array<Pet>> {
  try {
    const pets = await Pet.findAll({
      where: { userId, isLost: true },
      include: [User],
    });
    return pets;
  } catch (error) {
    console.log(error, "error en el pet-controler");
  }
}

async function updatePet(
  userId: number,
  petId: number,
  petData: petData
): Promise<any> {
  try {
    const { pictureURI, name, description, lat, lng, isLost } = petData;
    const user = await User.findByPk(userId);
    if (user == null) throw Error("user does not exists");

    const pictureURL = await checkIfPictureExists(pictureURI);

    const [number, pets] = await Pet.update(
      {
        name,
        pictureURL,
        description,
        userId: user.get("id"),
        lat,
        lng,
        isLost,
      },
      {
        where: { id: petId, userId: user.get("id") },
      }
    );
  } catch (error) {
    console.log(error, "error en el pet-controler");
  }
}

async function checkIfPictureExists(pictureURI: string): Promise<string> {
  if (pictureURI.split(":")[0] == "data") {
    const pictureURL = await cloudinary.uploader.upload(
      pictureURI,
      async (err, result) => {
        if (err) {
          throw err;
        }
        return result;
      }
    );
    return pictureURL.secure_url;
  } else {
    return pictureURI;
  }
}

async function getPet(petId: number): Promise<Pet> {
  try {
    const pet = await Pet.findOne({ where: { id: petId }, include: [User] });
    return pet;
  } catch (error) {}
}

export { createPet, getUserPets, updatePet, checkIfPictureExists, getPet };
