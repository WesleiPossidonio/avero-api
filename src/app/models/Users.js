import Sequelize, { Model } from "sequelize";
import bcrypt from 'bcrypt'

class Users extends Model {
  static init (sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },

        name: Sequelize.STRING,

        email: Sequelize.STRING,

        password_hash: {
          type: Sequelize.STRING,
          field: "password_hash",
        },

        password: Sequelize.VIRTUAL,

        googleId: {
          type: Sequelize.STRING,
          field: "google_id"  // <-- IMPORTANTÍSSIMO
        },

        avatar: {
          type: Sequelize.STRING,
          field: "avatar_url" // <-- IMPORTANTÍSSIMO
        },

        provider: {
          type: Sequelize.ENUM('local', 'google'),
          defaultValue: 'local',
        },
      },
      {
        sequelize,
        tableName: "users",
        underscored: true,
      }
    )

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10)
      }
    })

    return this
  }

  checkPassword (password) {
    return bcrypt.compare(password, this.password_hash);
  }

  static associate (models) {
    this.hasMany(models.Order, {
      foreignKey: 'userId',
      as: 'Orders',
    })
  }
}

export default Users;
