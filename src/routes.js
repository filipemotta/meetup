import express from "express";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import authMidd from "./app/middlewares/auth";
import { Router } from "express";
import User from "./app/models/User";
//const routes = express.Router();
const routes = Router();

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);
routes.use(authMidd);
routes.put("/users", UserController.update);
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
