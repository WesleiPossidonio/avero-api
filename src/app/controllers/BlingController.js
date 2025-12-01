import BlingService from "../services/BlingService.js";

class BlingController {
  async index (req, res) {
    try {
      const products = await BlingService.listProducts();
      return res.json(products);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async show (req, res) {
    try {
      const id = req.params.id;
      const product = await BlingService.getProductDetails(id);
      return res.json(product);
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  }
}

export default new BlingController();
