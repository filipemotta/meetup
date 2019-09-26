import express from "express";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import authMidd from "./app/middlewares/auth";
import { Router } from "express";
import User from "./app/models/User";
import multerConfig from "./config/multer";
import multer from "multer";
import FileController from "./app/controllers/FileController";
import MeetupControler from "./app/controllers/MeetupController";
//const routes = express.Router();
const routes = Router();
const upload = multer(multerConfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);
routes.use(authMidd);
routes.put("/users", UserController.update);
routes.post("/meetups", MeetupControler.store);
routes.get("/meetups", MeetupControler.index);
routes.delete("/meetups/:id", MeetupControler.delete);
routes.put("/meetups/:id", MeetupControler.update);
routes.post("/files", upload.single("file"), FileController.store);

// routes.get("/", (req, res) => {
//   res.send("Hello World again");
// });
// routes.get("/", async (req, res) => {
//   try {
//     const user = await User.create({
//       name: "Filipe Motta",
//       email: "filipemotta@gmail.com",
//       password: "123456"
//     });
//     return res.json(user);
//   } catch (error) {
//     return res.send(error);
//   }
// });
// routes.get("/", async (req, res) => {
//   const user = await User.create({
//     name: "Eduardo Motta",
//     email: "eduardomotta@gmail.com",
//     password: "123456"
//   });
//   return res.json(user);
// });

export default routes;
