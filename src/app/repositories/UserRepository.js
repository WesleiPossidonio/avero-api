import Users from "../models/Users.js";

class UserRepository {
  async findByEmail (email) {
    return await Users.findOne({ where: { email } });
  }

  async findById (id) {
    return await Users.findByPk(id);
  }

  async create (data) {
    return await Users.create(data);
  }

  async update (user, data) {
    return await user.update(data);
  }

  async findAll () {
    return await Users.findAll({
      attributes: ["id", "name", "email", "provider", "avatar_url"],
      order: [["createdAt", "ASC"]],
    });
  }
}

export default new UserRepository();
