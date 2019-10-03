import * as Yup from "yup";
import { Op } from "sequelize";
import { startOfDay, endOfDay, parseISO, isBefore } from "date-fns";
import Meetup from "../models/Meetup";
import User from "../models/User";
import File from "../models/File";
import Mail from "../../lib/Mail";

class MeetupController {
  async index(req, res) {
    const { date, page = 1 } = req.query;

    const searchDate = parseISO(date);

    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)]
        }
      },
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ["titulo", "localizacao", "descricao", "date"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email"]
        }
      ],
      include: [
        {
          model: File,
          as: "banner",
          attributes: ["name", "path"]
        }
      ]
    });
    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      titulo: Yup.string().required(),
      descricao: Yup.string().required(),
      localizacao: Yup.string().required(),
      date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: "validations fails. Review the required fields and try again !!"
      });
    }

    const { titulo, descricao, localizacao, date } = req.body;
    // const { user_id } = req.userId;

    const startDay = startOfDay(parseISO(date));

    if (isBefore(startDay, new Date())) {
      return res.status(400).json({ error: "Date input is past to due" });
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

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id != req.userId) {
      return res
        .status(401)
        .json({ error: "User does not have permission to do this operation." });
    }

    await meetup.destroy();

    return res.json({ information: `Meetup deleted id: ${req.params.id}` });
  }

  async update(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id != req.userId) {
      return res.status(401).json({
        error: "You cannot edit a meetup that you are not an organizer."
      });
    }

    const meetupDay = startOfDay(Date.parse(meetup.date));

    if (isBefore(meetupDay, new Date())) {
      return res.status(400).json({ error: "You cannot edit a past meetup" });
    }

    // const { titulo, descricao, localizacao, date } = req.body;
    const { titulo, descricao, localizacao, date } = await meetup.update(
      req.body
    );

    // meetup.titulo = titulo;
    // meetup.descricao = descricao;
    // meetup.localizacao = localizacao;
    // meetup.date = date;

    //await meetup.save();

    return res.json({
      titulo,
      descricao,
      localizacao,
      date
    });
  }
}

export default new MeetupController();
