import * as Yup from "yup";
import User from "../models/User";

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password_virtual: Yup.string()
        .required()
        .min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "validations fails" });
    }
    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: "User already exist !" });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email
    });
  }

  async update(req, res) {
    const { email } = req.body;
    const user = await User.findByPk(req.userId);

    if (email != user.email) {
      const userExist = await User.findOne({ where: { email: email } });
      if (userExist) {
        return res.status(401).json({ error: "User already exist" });
      }
    }
    const { id, name } = await User.update(req.body);

    return res.json({
      id,
      name,
    });
  }
}

export default new UserController();
