import axios from "axios";
import dotenv from "dotenv";
import BlingAuthService from "../services/BlingAuthService.js";

dotenv.config();

class BlingRepository {
  async getApiInstance () {
    // Garante token válido
    const token = await BlingAuthService.getValidToken();

    return axios.create({
      baseURL: "https://api.bling.com.br/Api/v3",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }

  async listProducts () {
    const api = await this.getApiInstance();

    const response = await api.get("/produtos", {
      params: {
        tipo: "T",
        pagina: 1,
        limite: 100,
      },
    });

    return response.data;
  }

  async getProductById (id) {
    const api = await this.getApiInstance();
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  }

  async createOrder (orderData) {
    const api = await this.getApiInstance();
    const response = await api.post("/orders", orderData);
    return response.data;
  }
}

export default new BlingRepository();
