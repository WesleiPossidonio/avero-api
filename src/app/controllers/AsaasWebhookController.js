import PaymentService from "../services/PaymentService.js";

class AsaasWebhookController {
  async handle (req, res) {
    try {
      const body = req.body;

      console.log("🔔 Webhook Asaas recebido:", JSON.stringify(body, null, 2));

      // Validação mínima
      if (!body || !body.event || !body.payment) {
        return res.status(400).json({ error: "Payload inválido" });
      }

      const asaasPaymentId = body.payment.id;
      const eventType = body.event;

      let newStatus = null;

      switch (eventType) {
        case "PAYMENT_CREATED":
        case "PAYMENT_UPDATED":
          return res.status(200).json({ message: "Evento ignorado" });

        case "PAYMENT_RECEIVED":
        case "PAYMENT_CONFIRMED":
          newStatus = "confirmed";
          break;

        case "PAYMENT_REFUNDED":
          newStatus = "refunded";
          break;

        case "PAYMENT_EXPIRED":
        case "PAYMENT_OVERDUE":
          newStatus = "expired";
          break;

        default:
          console.log("Evento não tratado:", eventType);
          return res.status(200).json({ message: "Evento ignorado" });
      }

      // Atualiza pagamento + status do pedido
      await PaymentService.updateStatusByAsaas(asaasPaymentId, newStatus);

      return res.status(200).json({ success: true });

    } catch (err) {
      console.error("Erro no webhook:", err);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new AsaasWebhookController();
