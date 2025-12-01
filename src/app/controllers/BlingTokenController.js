import BlingToken from "../models/BlingToken.js";

class BlingTokenController {
  async store (req, res) {
    try {
      const { access_token, refresh_token, expires_in } = req.body;

      if (!access_token || !refresh_token || !expires_in) {
        return res.status(400).json({
          error: "Campos obrigatórios: access_token, refresh_token, expires_in",
        });
      }

      const expires_at = new Date(Date.now() + expires_in * 1000);

      let token = await BlingToken.findOne();

      // Se já existir um token, ele é atualizado
      if (token) {
        await token.update({
          access_token,
          refresh_token,
          expires_at,
        });

        return res.status(200).json({
          message: "Token atualizado com sucesso!",
          token,
        });
      }

      // Senão, cria um novo
      token = await BlingToken.create({
        access_token,
        refresh_token,
        expires_at,
      });

      return res.status(201).json({
        message: "Token cadastrado com sucesso!",
        token,
      });

    } catch (error) {
      console.error("Erro ao salvar token do Bling:", error);
      return res.status(500).json({
        error: "Erro interno ao salvar token do Bling",
      });
    }
  }
}

export default new BlingTokenController();
