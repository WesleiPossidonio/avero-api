// src/repositories/OrderItemRepository.js
import OrderItem from "../models/OrderItem.js";

class OrderItemRepository {

  async create (data) {
    return await OrderItem.create(data);
  }

  async findById (id) {
    return await OrderItem.findByPk(id);
  }

  async findByOrderId (orderId) {
    return await OrderItem.findAll({
      where: { order_id: orderId },
    });
  }

  async update (id, data) {
    const item = await OrderItem.findByPk(id);
    if (!item) return null;

    return await item.update(data);
  }

  async delete (id) {
    return await OrderItem.destroy({ where: { id } });
  }
}

export default new OrderItemRepository();
