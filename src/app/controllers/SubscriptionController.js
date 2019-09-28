import User from "../models/User";
import Meetup from "../models/Meetup";
import Subscription from "../models/Subscription";
import { startOfDay, parse, parseISO, isBefore, isAfter } from "date-fns";

class SubscriptionController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.id, {
      // caso queira incluir no objeto informacoes do usuario que criou o meetup
      include: {
        model: User,
        as: "user"
      }
    });

    //Check date past meetup
    const checkMeetupDate = startOfDay(Date.parse(meetup.date));

    if (isBefore(checkMeetupDate, new Date())) {
      return res
        .status(400)
        .json({ error: "You cannot subscribe a past meetup" });
    }

    //check if a user is already subscribed on the meetup
    const checkUserMeetup = await Subscription.findOne({
      where: {
        user_id: user.id,
        meetup_id: meetup.id
      }
    });

    if (checkUserMeetup) {
      return res
        .status(400)
        .json({ error: "User is already subscribed on this meetup" });
    }

    //check if a user is already subscribed another meetup on the same time
    const checkUserSubscribe = await Subscription.findOne({
      where: {
        user_id: user.id
      },
      include: [
        {
          model: Meetup,
          as: "meetup",
          where: { date: meetup.date }
        }
      ]
    });

    if (checkUserSubscribe) {
      return res
        .status(400)
        .json({ error: "You cannot subscribe two meetups at the same time" });
    }

    //create meetup
    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
