// src/controllers/OrderItemController.js
import OrderItemService from "../services/OrderItemService.js";

class OrderItemController {

  async store (req, res) {
    try {
      const item = await OrderItemService.createItem(req.body);
      return res.status(201).json(item);
    } catch (err) {
      return res.status(400).json({ error: err.message || err.errors });
    }
  }

  async index (req, res) {
    const { orderId } = req.params;

    try {
      const items = await OrderItemService.listItems(orderId);
      return res.json(items);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async update (req, res) {
    const { id } = req.params;

    try {
      const updated = await OrderItemService.updateItem(id, req.body);
      return res.json(updated);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete (req, res) {
    const { id } = req.params;

    try {
      const result = await OrderItemService.deleteItem(id);
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export default new OrderItemController();
