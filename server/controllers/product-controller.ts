import { User, Pet } from "../models/index";

type productData = {
  price: number;
  title: string;
  description?: string;
};

export async function createProduct(
  userId: number,
  productData: productData
): Promise<Pet> {
  const { price, title, description = null } = productData;
  const user = await User.findByPk(userId);

  if (user == null) {
    throw Error("user does not exists");
  } else {
    const product = await Pet.create({
      title,
      price,
      description,
      userId: user.get("id"),
    });

    return product;
  }
}
