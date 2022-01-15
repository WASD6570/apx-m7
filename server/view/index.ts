import "dotenv/config";
import * as express from "express";
import { sequelize } from "../db";
import * as cors from "cors";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import { index } from "../lib/algolia";
import { createProfile, getUser } from "../controllers/user-controller";
import { authUser, createAuthUser } from "../controllers/auth-controller";
import { createReport } from "../controllers/report-controller";
import { sendEmail } from "../lib/sendgrid";
import {
  createPet,
  getUserPets,
  updatePet,
  checkIfPictureExists,
  getPet,
} from "../controllers/pet-controller";

//sequelize.sync({ force: true });

//puerto :)
const port = process.env.PORT || 8080;

// //secret jwt
const SECRET = process.env.JWT_SECRET;

// cosas de express && middlewares
const app = express();
app.use(cors());
app.use(express.json({ limit: 10000000 }));

app.use(express.static(path.resolve(__dirname, "../../dist")));

function authMiddleware(req, res, next: express.NextFunction): void {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, SECRET);
    req._user = data;
    next();
  } catch (error) {
    console.log(error.message);

    res.status(401).json({ error: "unauthorized" });
  }
}

//encriptador
function getSHA256ofString(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, created } = await createProfile({ email });
    if (created) {
      const userId = user.get().id;
      const { auth, created } = await createAuthUser(userId, {
        email,
        password: getSHA256ofString(password),
      });
      const token = jwt.sign({ id: auth.get("userId"), email }, SECRET);
      res.status(200).json(token);
    } else res.status(400).json({ message: "user already exists!" });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post("/auth/token", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUser(email);

    if (user == null)
      return res.status(400).json({ error: "email or pass incorrect" });

    const userId = user.get("id");
    const auth = await authUser(userId as any, {
      email,
      password: getSHA256ofString(password),
    });

    if (auth) {
      const token = jwt.sign({ id: auth.get("userId"), email }, SECRET);
      res.json(token);
    } else res.status(400).json({ error: "email or pass incorrect" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
});

app.post("/user/create-pet", authMiddleware, async (req, res) => {
  try {
    const { name, description, petPicture, lat, lng, isLost } = req.body;
    const user = await getUser(req._user.email);
    if (user == null)
      return res.status(401).json({ error: "please login first" });
    const userId = user.get().id;
    const { userPets, created } = await createPet(userId, {
      name,
      description,
      pictureURI: petPicture,
      lat,
      lng,
      isLost,
    });
    await index.saveObject({
      objectID: created.get("id"),
      pictureURL: created.get("pictureURL"),
      name,
      description,
      isLost,
      _geoloc: { lat, lng },
    });
    res.json(userPets);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "error en el endpoint" });
  }
});

app.post("/user/update-pet", authMiddleware, async (req, res) => {
  try {
    const { name, description, petPicture, lat, lng, isLost, petId } = req.body;

    const user = await getUser(req._user.email);
    if (user == null)
      return res.status(401).json({ error: "please login first" });
    const userId = user.get().id;
    const pets = await updatePet(userId, petId, {
      name,
      description,
      pictureURI: petPicture,
      lat,
      lng,
      isLost,
    });

    console.log(pets);

    const pictureURL = await checkIfPictureExists(petPicture);
    await index.partialUpdateObject({
      objectID: petId,
      pictureURL,
      name,
      description,
      isLost,
      _geoloc: { lat, lng },
    });

    res.json(pets);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/user/reported-pets", authMiddleware, async (req, res) => {
  try {
    const user = await getUser(req._user.email);
    if (user == null)
      return res.status(401).json({ error: "please login first" });
    const userId = user.get().id;
    const pets = await getUserPets(userId);

    res.json({ pets });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "error en el endpoint" });
  }
});

app.get("/pets-around", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    const { hits } = await index.search("", {
      filters: "isLost:true",
      aroundRadius: 5000,
      aroundLatLng: [lat, lng].join(","),
    });
    res.json({ hits });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/user/send-report", authMiddleware, async (req, res) => {
  try {
    const { name, phone, email, description, id } = req.body;

    const pet = await getPet(id);

    const userId = pet.get().userId;

    const ownerMail = pet.get().user.dataValues.email;

    const info = {
      reporterPhone: phone,
      description: description,
      reporterEmail: email,
    };

    await createReport(id, userId, info);

    await sendEmail({ name, phone, description, ownerMail, email });

    res.json({ message: "email sent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/mapbox-token", (req, res) => {
  res.json({
    token: process.env.MAPBOX_TOKEN,
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

app.listen(port, () => {
  console.log(`app runing on http://localhost:${port}`);
});
