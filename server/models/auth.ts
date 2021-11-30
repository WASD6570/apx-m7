import { sequelize } from "../db/index";
import { DataTypes, Model } from "sequelize";

export class Auth extends Model {}

Auth.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "auth",
  }
);
