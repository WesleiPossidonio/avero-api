import redis from "../../database/redis/index.js";
import BlingRepository from "../repositories/BlingRepository.js";

class BlingService {

  CACHE_TTL = 60 * 5; // 5 minutos
  METRICS_PREFIX = "metrics:bling-cache";

  async registerCacheMiss (type, key) {
    await redis.incr(`${this.METRICS_PREFIX}:miss:total`);
    await redis.incr(`${this.METRICS_PREFIX}:miss:${type}`);
    await redis.incr(`${this.METRICS_PREFIX}:miss:key:${key}`);
    console.warn(`[CACHE MISS] key="${key}" type="${type}"`);
  }

  // -----------------------------
  // 🔹 LISTAR PRODUTOS
  // -----------------------------
  async listProducts () {
    const cacheKey = "bling:products";

    const cached = await redis.get(cacheKey);
    if (cached) {
      return { fromCache: true, data: JSON.parse(cached) };
    }

    await this.registerCacheMiss("list", cacheKey);

    try {
      const response = await BlingRepository.listProducts();

      const data = response.data; // ⭐ SOMENTE OS DADOS

      await redis.set(cacheKey, JSON.stringify(data), "EX", this.CACHE_TTL);

      return { fromCache: false, data };
    } catch (error) {
      console.error("Erro ao listar produtos do Bling:", error.response?.data || error);
      throw new Error("Erro ao buscar produtos no Bling");
    }
  }

  // -----------------------------
  // 🔹 BUSCAR PRODUTO POR ID
  // -----------------------------
  async getProductById (id) {
    const cacheKey = `bling:product:${id}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return { fromCache: true, data: JSON.parse(cached) };
    }

    await this.registerCacheMiss("item", cacheKey);

    try {
      const response = await BlingRepository.getProductById(id);

      const data = response.data; // ⭐ SOMENTE OS DADOS

      await redis.set(cacheKey, JSON.stringify(data), "EX", this.CACHE_TTL);

      return { fromCache: false, data };
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error.response?.data || error);
      throw new Error("Erro ao buscar produto no Bling");
    }
  }
}

export default new BlingService();
