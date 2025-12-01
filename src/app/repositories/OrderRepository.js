// src/repositories/OrderRepository.js
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Payment from "../models/Payment.js";

class OrderRepository {
  async create (data) {
    return await Order.create(data);
  }

  async findById (id) {
    return await Order.findByPk(id, {
      include: [
        { model: OrderItem, as: "OrdersItems" },
        { model: Payment, as: "Payments" }
      ]
    });
  }

  async findByUserId (userId) {
    return await Order.findAll({
      where: { user_id: userId },
      include: [
        { model: OrderItem, as: "OrdersItems" },
        { model: Payment, as: "Payments" }
      ],
      order: [["createdAt", "DESC"]]
    });
  }

  async update (order, data) {
    return await order.update(data);
  }

  async delete (id) {
    return await Order.destroy({ where: { id } });
  }

  async updateStatus (orderId, status) {
    const order = await Order.findByPk(orderId);
    if (!order) return null;

    order.status = status;
    await order.save();

    return order;
  }

}

export default new OrderRepository();
