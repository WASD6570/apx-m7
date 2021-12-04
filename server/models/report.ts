import { sequelize } from "../db/index";
import { DataTypes, Model } from "sequelize";

export class Report extends Model {}

Report.init(
  {
    reporterEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reporterPhone: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    petId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "report",
  }
);
