import * as Yup from "yup";
import validator from "validator";
import jwt from "jsonwebtoken";
import authConfig from "../../config/auth.js";
import Users from "../models/Users.js";

const sanitizeInput = (data) => {
  const sanitizedData = {};
  Object.keys(data).forEach((key) => {
    sanitizedData[key] =
      typeof data[key] === "string" ? validator.escape(data[key]) : data[key];
  });
  return sanitizedData;
};

class SessionController {
  // ✅ LOGIN LOCAL (email + senha)
  async store (request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    const sanitizedBody = sanitizeInput(request.body);

    if (!(await schema.isValid(sanitizedBody))) {
      return response
        .status(400)
        .json({ error: "Verifique seu email e senha." });
    }

    const { email, password } = sanitizedBody;

    // ✅ Procura o usuário
    const user = await Users.findOne({ where: { email } });

    // ✅ Usuário não existe OU senha errada
    if (!user || !(await user.checkPassword(password))) {
      return response
        .status(400)
        .json({ error: "Email ou senha incorretos" });
    }

    // ✅ Gera o token
    const token = jwt.sign(
      {
        id: user.id,
        provider: user.provider, // local ou google
        role: 'user'
      },
      authConfig.secret,
      { expiresIn: authConfig.expiresIn }
    );

    return response.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
      },
    });
  }

  // ✅ Valida token e retorna dados do usuário
  async index (request, response) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(401).json({ error: "Token não enviado" });
    }

    const [, token] = authHeader.split(" ");

    try {
      const decoded = jwt.verify(token, authConfig.secret);

      const { id } = decoded;

      const user = await Users.findByPk(id, {
        attributes: ["id", "name", "email", "provider", "avatar_url"],
      });

      if (!user) {
        return response.status(404).json({ error: "Usuário não encontrado" });
      }

      return response.status(200).json({
        authenticated: true,
        user,
      });
    } catch (error) {
      return response.status(401).json({
        error: "Token inválido ou expirado",
      });
    }
  }
}

export default new SessionController();
