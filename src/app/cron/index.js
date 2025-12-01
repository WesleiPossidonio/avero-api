import cron from "node-cron";
import BlingAuthService from "../services/BlingAuthService.js";

cron.schedule("0 */5 * * *", async () => {
  try {
    console.log("⏳ Atualizando token do Bling...");
    await BlingAuthService.getValidToken();
    console.log("✅ Token atualizado");
  } catch (err) {
    console.error("Erro ao atualizar token:", err.message);
  }
});

console.log("🔁 CRON do Bling iniciado (atualiza a cada 5 horas)");
