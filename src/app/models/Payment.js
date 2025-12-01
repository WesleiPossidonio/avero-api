import Sequelize, { Model } from "sequelize";

class Payment extends Model {
  static init (sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        order_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        asaasPaymentId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        method: {
          type: Sequelize.ENUM("credit_card", "boleto", "pix"),
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM("pending", "confirmed", "expired", "refunded"),
          allowNull: false,
          defaultValue: "pending",
        },
        value: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "payments",
      }
    );

    return this;
  }

  static associate (models) {
    this.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
    });
  }
}

export default Payment;
