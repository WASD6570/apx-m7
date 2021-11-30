import { sequelize } from "./index";

sequelize.sync({ force: true }).then(() => {
  console.log("done!");
});
