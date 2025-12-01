// src/controllers/PaymentController.js
import PaymentService from "../services/PaymentService.js";

class PaymentController {
  async store (req, res) {
    const { orderId } = req.params;
    const { method, value, asaasPaymentId } = req.body;

    try {
      const payment = await PaymentService.createPayment(
        orderId,
        method,
        value,
        asaasPaymentId
      );

      return res.status(201).json(payment);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async show (req, res) {
    try {
      const payment = await PaymentService.getById(req.params.id);
      return res.json(payment);
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  }

  async listByOrder (req, res) {
    try {
      const list = await PaymentService.getByOrder(req.params.orderId);
      return res.json(list);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async updateStatus (req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const updated = await PaymentService.updateStatus(id, status);
      return res.json(updated);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async createCharge (req, res) {
    const { orderId } = req.params;
    const { method, customer } = req.body;

    try {
      const result = await PaymentService.createCharge(orderId, method, customer);
      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export default new PaymentController();
