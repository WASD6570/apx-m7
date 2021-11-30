import { sequelize } from "../db/index";
import { DataTypes, Model } from "sequelize";

export class User extends Model {}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);
