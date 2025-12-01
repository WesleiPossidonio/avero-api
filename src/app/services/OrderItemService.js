// src/services/OrderItemService.js
import * as Yup from "yup";
import OrderItemRepository from "../repositories/OrderItemRepository.js";
import OrderRepository from "../repositories/OrderRepository.js";

class OrderItemService {

  async createItem (data) {
    // Validação
    const schema = Yup.object().shape({
      order_id: Yup.string().uuid().required(),
      product_id: Yup.string().uuid().required(),
      name: Yup.string().required(),
      quantity: Yup.number().min(1).required(),
      unit_price: Yup.number().required(),
    });

    await schema.validate(data, { abortEarly: false });

    // Garantir que o pedido existe
    const orderExists = await OrderRepository.findById(data.order_id);
    if (!orderExists) {
      throw new Error("Pedido não encontrado");
    }

    // Criar item
    return await OrderItemRepository.create(data);
  }

  async listItems (orderId) {
    return await OrderItemRepository.findByOrderId(orderId);
  }

  async updateItem (id, data) {
    const item = await OrderItemRepository.findById(id);
    if (!item) {
      throw new Error("Item não encontrado");
    }

    return await OrderItemRepository.update(id, data);
  }

  async deleteItem (id) {
    const deleted = await OrderItemRepository.delete(id);
    if (!deleted) {
      throw new Error("Item não encontrado");
    }
    return { message: "Item removido com sucesso" };
  }
}

export default new OrderItemService();
