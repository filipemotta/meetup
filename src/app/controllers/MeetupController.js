import * as Yup from "yup";
import { startOfDay, parseISO, isBefore } from "date-fns";
import Meetup from "../models/Meetup";
import User from "../models/User";
import File from "../models/File";

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      titulo: Yup.string().required(),
      descricao: Yup.string().required(),
      localizacao: Yup.string().required(),
      date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "validations fails" });
    }

    const { titulo, descricao, localizacao, date } = req.body;
    // const { user_id } = req.userId;

    const startDay = startOfDay(parseISO(date));

    if (isBefore(startDay, new Date())) {
      return res.status(400).json({ error: "Date input is past due" });
    }

    const meetup = await Meetup.create({
      user_id: req.userId,
      titulo,
      descricao,
      localizacao,
      date,
      canceled_at: null
    });

    return res.json(meetup);
  }
}

export default new MeetupController();
