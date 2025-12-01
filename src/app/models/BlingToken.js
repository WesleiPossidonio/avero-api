import Sequelize, { Model } from "sequelize";

class BlingToken extends Model {
  static init (sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        access_token: Sequelize.TEXT,
        refresh_token: Sequelize.TEXT,
        expires_at: Sequelize.DATE,
      },
      { sequelize }
    );

    return this;
  }
}

export default BlingToken;
