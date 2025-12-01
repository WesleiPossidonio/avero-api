import * as Yup from "yup";
import UserService from "../services/UserService.js";

class UserController {
  async store (req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    try {
      await schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }

    try {
      const user = await UserService.registerLocalUser(req.body);

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
      });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async index (req, res) {
    const users = await UserService.listUsers();
    return res.status(200).json(users);
  }

  async update (req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().optional(),
      email: Yup.string().email().optional(),
      password: Yup.string().min(6).optional(),
      avatar_url: Yup.string().optional(),
    });

    try {
      await schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }

    try {
      await UserService.updateUser(req.params.id, req.body);
      return res.status(200).json({ message: "Usuário atualizado com sucesso" });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export default new UserController();
