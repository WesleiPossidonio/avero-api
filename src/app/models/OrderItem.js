import Sequelize, { Model } from "sequelize";

class OrderItem extends Model {
  static init (sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        order_id: Sequelize.UUID,
        product_id: Sequelize.UUID,
        name: Sequelize.STRING,
        quantity: Sequelize.INTEGER,
        unit_price: Sequelize.DECIMAL(10, 2),
      },
      {
        sequelize
      }
    )

    return this
  }

  static associate (models) {
    this.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'OrdersItems',
    })
  }
}

export default OrderItem