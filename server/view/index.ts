import "dotenv/config";
import * as express from "express";
import { sequelize } from "../db";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import { index } from "../lib/algolia";
import { createProfile, getUser } from "../controllers/user-controller";
import { authUser, createAuthUser } from "../controllers/auth-controller";
import { createReport } from "../controllers/report-controller";
import * as sgMail from "@sendgrid/mail";
import {
  createPet,
  getUserPets,
  updatePet,
  checkIfPictureExists,
  getPet,
} from "../controllers/pet-controller";

//sequelize.sync({ alter: true });

//puerto :)
const port = process.env.PORT || 3000;

// //secret jwt
const SECRET = process.env.JWT_SECRET;

// cosas de express && middlewares
const app = express();
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
      res.json(token);
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
    const pet = await createPet(userId, {
      name,
      description,
      pictureURI: petPicture,
      lat,
      lng,
      isLost,
    });
    await index.saveObject({
      objectID: pet.get("id"),
      pictureURL: pet.get("pictureURL"),
      name,
      description,
      isLost,
      _geoloc: { lat, lng },
    });
    res.json({ pet });
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
    const pet = await updatePet(userId, petId, {
      name,
      description,
      pictureURI: petPicture,
      lat,
      lng,
      isLost,
    });

    const pictureURL = await checkIfPictureExists(petPicture);
    await index.partialUpdateObject({
      objectID: petId,
      pictureURL,
      name,
      description,
      isLost,
      _geoloc: { lat, lng },
    });

    res.json({ pet });
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
    const body = req.body;

    const pet = await getPet(body.id);

    const userId = pet.get().userId;

    const ownerMail = pet.get().user.dataValues.email;

    const info = {
      reporterPhone: body.phone,
      description: body.description,
      reporterEmail: body.email,
    };

    const test = await createReport(body.id, userId, info);

    sgMail.setApiKey(process.env.MAIL_API_KEY);
    const msg = {
      to: ownerMail,
      from: "wasd12.ns@gmail.com",
      subject: "Info sobre tu mascota perdida",
      text: `Hola soy ${body.name}. ${body.description}, comunicate con migo para tener mas info: email:${body.email}, telefono: ${body.phone}`,
      html: `<h2> Hola soy ${body.name}. ${body.description}, comunicate con migo para tener mas info: email: ${body.email}, telefono: ${body.phone}</h2>`,
    };
    await sgMail.send(msg);

    res.json({ message: "email sent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

app.listen(port, () => {
  console.log(`app runing on http://localhost:${port}`);
});
