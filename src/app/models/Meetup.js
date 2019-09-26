import Sequelize, { Model } from "sequelize";

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: Sequelize.STRING,
        descricao: Sequelize.STRING,
        localizacao: Sequelize.STRING,
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE
      },
      {
        sequelize
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.File, { foreignKey: "banner_id", as: "banner" });
  }
}

export default Meetup;
