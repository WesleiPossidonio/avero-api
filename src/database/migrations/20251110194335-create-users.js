'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      google_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      avatar_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      provider: {
        type: Sequelize.ENUM('local', 'google'),
        allowNull: false,
        defaultValue: 'local',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
