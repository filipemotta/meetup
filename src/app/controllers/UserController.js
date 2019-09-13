import User from "../models/User";

class UserController {
  async store(req, res) {
    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: "Usuario existe !" });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email
    });
  }

  async update(req, res) {
    const user = await User.findByPk(req.user.id);
    const { id, name, email } = User.update(req.body);

    return res.json({
      id,
      name,
      email
    });
  }
}

export default new UserController();
