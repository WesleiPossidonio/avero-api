import sequelize from "../../database/index.js";
import OrderRepository from "../repositories/OrderRepository.js";
import OrderItem from "../models/OrderItem.js";

class OrderService {

  async createOrder ({ user_id, items }) {

    if (!items || items.length === 0) {
      throw new Error("Nenhum item enviado para criar pedido.");
    }

    const transaction = await sequelize.transaction();

    try {
      const total_amount = items.reduce((acc, item) => {
        return acc + item.unit_price * item.quantity;
      }, 0);

      // Criar pedido
      const order = await OrderRepository.create(
        { user_id, total_amount, status: "pending-payment" },
        { transaction }
      );

      // Mapear itens
      const mappedItems = items.map((i) => ({
        order_id: order.id,
        product_id: i.product_id,
        name: i.name,
        quantity: i.quantity,
        unit_price: i.unit_price,
      }));

      // Criar itens
      await OrderItem.bulkCreate(mappedItems, { transaction });

      // Finaliza com sucesso
      await transaction.commit();

      return await OrderRepository.findById(order.id);

    } catch (err) {
      // Se der erro: rollback
      await transaction.rollback();
      throw err;
    }
  }

  async updateOrderStatusByPayment (orderId, paymentStatus) {
    const order = await OrderRepository.findById(orderId);
    if (!order) throw new Error("Pedido não encontrado");

    let newOrderStatus = order.status;

    switch (paymentStatus) {
      case "confirmed":
        newOrderStatus = "paid";
        break;
      case "expired":
        newOrderStatus = "payment-expired";
        break;
      case "refunded":
        newOrderStatus = "refunded";
        break;
      case "pending":
        newOrderStatus = "pending-payment";
        break;
    }

    await OrderRepository.update(order, { status: newOrderStatus });

    return order;
  }


}

export default new OrderService();
