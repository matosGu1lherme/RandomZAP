'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'isLogged', 'is_logged', {
      type: Sequelize.BOOLEAN,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'isLogged', 'is_logged', {
      type: Sequelize.BOOLEAN,
    });
  },
};
