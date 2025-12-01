'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'order', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      // ID gerado pelo Asaas (paymentId ou chargeId)
      asaas_payment_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },

      // ID do customer criado no Asaas
      asaas_customer_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // URL para redirecionar o cliente (Checkout)
      checkout_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // URL do boleto (se método for boleto)
      boleto_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // Código do PIX em base64 (ou link copia e cola)
      pix_qr_code: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      pix_qr_code_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      method: {
        type: Sequelize.ENUM('credit_card', 'boleto', 'pix'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          'pending',
          'confirmed',
          'received',
          'received_in_cash',
          'overdue',
          'refunded',
          'cancelled'
        ),
        defaultValue: 'pending',
      },


      value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      // Quando o Asaas confirmar o pagamento
      paid_at: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.dropTable('payments');
  },
};
