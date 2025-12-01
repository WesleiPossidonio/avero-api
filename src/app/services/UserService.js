import UserRepository from "../repositories/UserRepository.js";

class UserService {
  async registerLocalUser ({ name, email, password }) {
    const exists = await UserRepository.findByEmail(email);
    if (exists) {
      throw new Error("Usuário já cadastrado");
    }

    const user = await UserRepository.create({
      name,
      email,
      password,
      provider: "local",
    });

    return user;
  }

  async updateUser (id, data) {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (data.email && data.email !== user.email) {
      const emailExists = await UserRepository.findByEmail(data.email);
      if (emailExists) {
        throw new Error("E-mail já em uso");
      }
    }

    const updated = await UserRepository.update(user, data);
    return updated;
  }

  async listUsers () {
    return UserRepository.findAll();
  }
}

export default new UserService();
