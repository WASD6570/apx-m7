import { sequelize } from "../db/index";
import { DataTypes, Model } from "sequelize";

export class Report extends Model {}

Report.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "report",
  }
);
