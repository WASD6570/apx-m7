import * as express from "express";
import { sequelize } from "../db";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import { index } from "../lib/algolia";
import { createProfile, getUser } from "../controllers/user-controller";
import { authUser, createAuthUser } from "../controllers/auth-controller";
import { createPet } from "../controllers/pet-controller";

//sequelize.sync({ force: true });

//puerto :)
const port = process.env.PORT || 3000;

// //secret jwt
const SECRET = "alto_secret_wuachiiin123";

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
    const { name, description, pictureURI, lat, lng } = req.body;
    const user = await getUser(req._user.email);
    if (user == null)
      return res.status(401).json({ error: "please login first" });
    const userId = user.get().id;
    const pet = await createPet(userId, {
      name,
      description,
      pictureURI,
      lat,
      lng,
    });
    await index.saveObject({
      name,
      description,
      _geoloc: { lat, lng },
    });
    res.json({ pet });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

// app.post("/products", authMiddleware, async (req, res) => {
//   try {
//     const { title, price, description = "" } = req.body;
//     const [product, created] = await Product.findOrCreate({
//       where: { title, userId: req._user.id },
//       defaults: {
//         title,
//         price,
//         description,
//         userId: req._user.id,
//       },
//     });
//     res.json({ product, created });
//   } catch (error) {
//     res.json({ error: error.message });
//   }
// });

// app.get("/products", authMiddleware, async (req, res) => {
//   try {
//     const products = await Product.findAll({
//       where: { userId: req._user.id },
//     });
//     res.json({ products });
//   } catch (error) {
//     res.json({ error: error.message });
//   }
// });

// app.get("/me", authMiddleware, async (req, res) => {
//   try {
//     const auth = await Auth.findOne({
//       where: { userId: req._user.id },
//       include: [User],
//     });
//     res.json({ auth });
//   } catch (error) {
//     res.json({ error: error.message });
//   }
// });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

app.listen(port, () => {
  console.log(`app runing on http://localhost:${port}`);
});
