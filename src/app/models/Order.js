import Sequelize, { Model } from "sequelize";

class Order extends Model {
  static init (sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        user_id: Sequelize.UUID,
        status: {
          type: Sequelize.ENUM(
            "pending-payment",
            "paid",
            "sent-to-bling",
            "invoice-issued",
            "in-shipping",
            "delivered",
            "cancelled"
          ),
          defaultValue: "pending-payment",
        },
        total_amount: Sequelize.DECIMAL(10, 2),
        bling_order_id: Sequelize.STRING,
      },
      {
        sequelize
      }
    )

    return this
  }

  static associate (models) {
    this.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'Orders',
    })

    this.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'OrdersItems',
    })

    this.hasMany(models.Payment, {
      foreignKey: 'orderId',
      as: 'Payments',
    })
  }
}

export default Order