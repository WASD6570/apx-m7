import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  username: "qdlvwudxshwcvi",
  password: "a624a2f9e14c3496f01b3f39a0594d33128edad3624b6bd05f4ea6268afe1e31",
  database: "d94bu7skroaqfk",
  port: 5432,
  host: "ec2-34-194-123-31.compute-1.amazonaws.com",
  ssl: true,
  // esto es necesario para que corra correctamente
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
