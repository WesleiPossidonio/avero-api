// src/controllers/OrderController.js
import * as Yup from "yup";
import OrderService from "../services/OrderService.js";

class OrderController {

  // Criar pedido
  async store (request, response) {
    const schema = Yup.object().shape({
      user_id: Yup.string().required(),
      items: Yup.array()
        .of(
          Yup.object().shape({
            product_id: Yup.string().required(),
            name: Yup.string().required(),
            quantity: Yup.number().required().min(1),
            unit_price: Yup.number().required().min(0),
          })
        )
        .required()
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ errors: err.errors });
    }

    try {
      const order = await OrderService.createOrder(request.body);
      return response.status(201).json(order);

    } catch (err) {
      return response.status(500).json({ error: err.message });
    }
  }

  // Buscar único pedido
  async show (request, response) {
    const { id } = request.params;

    try {
      const order = await OrderService.getById(id);
      return response.status(200).json(order);

    } catch (err) {
      return response.status(404).json({ error: err.message });
    }
  }

  // Listar pedidos do usuário
  async index (request, response) {
    const { userId } = request.params;

    try {
      const list = await OrderService.getByUser(userId);
      return response.status(200).json(list);

    } catch (err) {
      return response.status(500).json({ error: err.message });
    }
  }
}

export default new OrderController();
