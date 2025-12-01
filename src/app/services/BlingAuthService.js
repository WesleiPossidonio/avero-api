import BlingToken from "../models/BlingToken.js";
import axios from "axios";

class BlingAuthService {
  async getValidToken () {
    const tokenData = await BlingToken.findOne();

    if (!tokenData) {
      throw new Error("Nenhum token do Bling encontrado no banco.");
    }

    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);

    // 🔍 Token expirado?
    if (now >= expiresAt) {
      console.log("🔄 Token do Bling expirado. Renovando automaticamente...");
      const newTokens = await this.refreshToken(tokenData.refresh_token);
      // Atualiza o registro no banco
      await tokenData.update({
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
        expires_at: newTokens.expires_at,
      });

      console.log("✅ Token renovado com sucesso!");

      return newTokens.access_token;
    }

    // Token ainda válido
    return tokenData.access_token;
  }

  async refreshToken (refreshToken) {
    try {
      const basicAuth = Buffer.from(
        `${process.env.BLING_CLIENT_ID}:${process.env.BLING_CLIENT_SECRET}`
      ).toString("base64");

      const payload = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });

      const response = await axios.post(
        "https://api.bling.com.br/Api/v3/oauth/token",
        payload.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${basicAuth}`,
          },
        }
      );

      const data = response.data;

      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: new Date(Date.now() + data.expires_in * 1000),
      };
    } catch (error) {
      console.error("❌ Erro ao renovar token do Bling:", error.response?.data || error);
      throw new Error("Falha ao renovar token do Bling.");
    }
  }

}

export default new BlingAuthService();
