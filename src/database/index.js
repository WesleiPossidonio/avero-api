import Sequelize from 'sequelize';
import BlingToken from '../app/models/BlingToken.js';
import Order from '../app/models/Order.js';
import OrderItem from '../app/models/OrderItem.js';
import Payment from '../app/models/Payment.js';
import Users from '../app/models/Users.js';
import configDataBase from '../config/database'

const models = [BlingToken, Order, OrderItem, Payment, Users];

class Database {
  constructor() {
    this.connection = new Sequelize(configDatabase);
    this.init();
  }

  init () {
    // Inicializa todos os models
    models.forEach((model) => model.init(this.connection));

    // Associações
    models.forEach((model) => {
      if (typeof model.associate === 'function') {
        model.associate(this.connection.models);
      }
    });
  }
}

const databaseInstance = new Database();

// 🔥 AQUI EXPORTA A INSTÂNCIA DO SEQUELIZE
export const sequelize = databaseInstance.connection;

export default databaseInstance;
