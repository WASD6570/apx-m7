import { Auth } from "./auth";
import { Pet } from "./pet";
import { User } from "./user";
import { Report } from "./report";

User.hasOne(Auth);
User.hasMany(Pet);
User.hasMany(Report);
Pet.hasMany(Report);
Report.belongsTo(Pet);
Pet.belongsTo(User);
Auth.belongsTo(User);
Report.belongsTo(User);

export { User, Auth, Pet, Report };
