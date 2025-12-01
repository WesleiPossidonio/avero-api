import PaymentRepository from "../repositories/PaymentRepository.js";
import OrderRepository from "../repositories/OrderRepository.js";
import OrderService from "./OrderService.js";

class PaymentService {
  async createPayment (orderId, method, value, asaasPaymentId = null) {
    const order = await OrderRepository.findById(orderId);
    if (!order) throw new Error("Pedido não encontrado");

    return await PaymentRepository.create({
      order_id: orderId,
      method,
      value,
      asaasPaymentId,
      status: "pending",
    });
  }

  async getById (id) {
    const payment = await PaymentRepository.findById(id);
    if (!payment) throw new Error("Pagamento não encontrado");
    return payment;
  }

  async getByOrder (orderId) {
    return await PaymentRepository.findByOrderId(orderId);
  }

  async updateStatus (paymentId, newStatus) {
    const payment = await PaymentRepository.findById(paymentId);
    if (!payment) throw new Error("Pagamento não encontrado");

    payment.status = newStatus;
    await payment.save();

    await OrderService.updateOrderStatusByPayment(payment.order_id, newStatus);

    return payment;
  }

  async createCharge (orderId, method, customerData) {
    const order = await OrderRepository.findById(orderId);
    if (!order) throw new Error("Pedido não encontrado");

    // 1️⃣ Criar customer no Asaas
    const customerResponse = await fetch("https://www.asaas.com/api/v3/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": process.env.ASAAS_KEY,
      },
      body: JSON.stringify(customerData),
    });

    const customer = await customerResponse.json();

    if (!customerResponse.ok) {
      console.log("Erro ao criar customer:", customer);
      throw new Error("Erro ao criar cliente no Asaas");
    }

    // 2️⃣ Criar cobrança
    const billingTypeMap = {
      pix: "PIX",
      boleto: "BOLETO",
      credit_card: "CREDIT_CARD",
    };

    const payload = {
      customer: customer.id, // <-- agora é o customerId do Asaas!
      billingType: billingTypeMap[method],
      value: Number(order.total_amount),
      description: `Pagamento do pedido ${orderId}`,
    };

    const paymentResponse = await fetch("https://www.asaas.com/api/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": process.env.ASAAS_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.log("Erro ao criar cobrança:", data);
      throw new Error("Erro ao criar cobrança no Asaas");
    }

    // 3️⃣ Salvar no banco
    const payment = await PaymentRepository.create({
      order_id: orderId,
      method,
      value: order.total_amount,
      asaas_customer_id: customer.id, // <-- agora salva também o customer
      asaas_payment_id: data.id,
      status: "PENDING",
    });

    return {
      payment,
      asaas: data,
    };
  }


  async updateStatusByAsaas (asaasPaymentId, newStatus) {
    const payment = await PaymentRepository.findByAsaasId(asaasPaymentId);

    if (!payment) throw new Error("Pagamento não encontrado pelo ID Asaas");

    payment.status = newStatus;
    await payment.save();

    await OrderService.updateOrderStatusByPayment(payment.order_id, newStatus);

    return payment;
  }
}

export default new PaymentService();
