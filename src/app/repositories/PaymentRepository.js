import Payment from "../models/Payment.js";

class PaymentRepository {
  async create (data) {
    return await Payment.create(data);
  }

  async findById (id) {
    return await Payment.findByPk(id);
  }

  async findByOrderId (orderId) {
    return await Payment.findAll({ where: { order_id: orderId } });
  }

  async update (payment, data) {
    return await payment.update(data);
  }

  async findByAsaasId (asaasPaymentId) {
    return await Payment.findOne({ where: { asaasPaymentId } });
  }

}

export default new PaymentRepository();
